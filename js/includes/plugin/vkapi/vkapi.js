/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

_GViK.Init( function( gvik, require ) {

  "use strict";

  var

    core = require( 'core' ),
    chrome = require( 'chrome' ),
    options = require( 'options' ),
    storage = require( 'storage' ),

    VKAPI = function() {
      this.KEY_TOKEN = "vk";
      this.ROOT_URL = "https://api.vk.com/method/";
      this.APP_ID = "2224353";
      this.USER_ID = gvik.UNIQ_ID;


      this.permission = [ 'friends',
                'groups',
                'audio',
                'video'
            ];

      this.isOffline = options.get( 'vkapi', 'offline' );

      if ( this.isOffline ) {
        this.pushPermission( 'offline' );
      }

      this.saved = [];

    };



  var _fnReAuth = function( method, data, success, error ) {

    storage.local.remove( this.KEY_TOKEN );
    chrome.local.remove( 'vk' );

    this.saved.push( [ method, data, success, error ] );
    this.auth( null, null, null, false );
  };


  VKAPI.prototype = {

    get data() {
      return storage.local.getJson( this.KEY_TOKEN ) || {};
    },

    get token() {
      return this.data.token;
    },

    _setToken: function( token ) {

      storage.local.setJson( this.KEY_TOKEN, {
        token: token,
        isOffline: this.isOffline
      } );


      chrome.local.set( {
        vk: {
          token: token,
          isOffline: this.isOffline
        }
      } );

    },

    _callSaved: function() {

      if ( !this.saved.length ) {
        return;
      }


      var cur = this.saved.shift(),
        method = cur.shift(),
        data = cur.shift(),
        success = cur.shift(),
        error = cur.shift();

      if ( success === undefined ) {
        return;
      }

      this.call( method, data, function() {
        success.apply( this, arguments );
        this._callSaved();
      }.bind( this ), error );

    },
    _errIds: {
      '5': _fnReAuth,
      '10': _fnReAuth
    },
    runIdError: function( errId, args ) {
      var errFn = this._errIds[ errId ];
      if ( typeof errFn === 'function' ) {
        errFn.apply( this, args );
      }
    },

    call: function( method, data, success, error ) {

      if ( typeof data === 'function' ) {
        error = success;
        success = data;
        data = {};
      } else {
        data = data || {};
      }

      if ( !data.no_auth ) {
        if ( !this.authorized ) {
          this.saved.push( [ method, data, success, error ] );
          return this.auth();
        }
        data.access_token = this.token;
      }

      data.v = "5";
      data.https = 1;

      data._nocache = Date.now();

      chrome.simpleAjax( {
        type: 'POST',
        url: this.ROOT_URL + method,
        dataType: 'json',
        data: data
      }, function( res ) {
        if ( res.hasOwnProperty( 'response' ) ) {
          if ( typeof success === 'function' ) {
            success( res.response );
          }
        } else if ( res.hasOwnProperty( 'error' ) ) {
          if ( typeof error === 'function' ) {
            error( res.error );
          }
          this.runIdError.call( this, res.error.error_code, [ method, data, success, error ] );
        }
      }.bind( this ), error );


      return this;
    },

    pushPermission: function( perName ) {
      if ( this.permission.indexOf( perName ) === -1 ) {
        this.permission.push( perName );
      }
    },

    showWindowAuth: function( callback, error, _focus ) {

      var width = parseInt( screen.width / 2 ),
        height = parseInt( screen.height / 2 );

      chrome.sendRequest( "auth", {
        data: {
          url: 'https://oauth.vk.com/authorize?' + core.map( {
              client_id: 2224353,
              scope: this.permission /* || 474367*/ ,
              v: 5,
              redirect_uri: 'blank.html',
              display: 'popup',
              response_type: 'token'
            }, function( v, k ) {
              return k + '=' + v
            } )
            .join( '&' ),

          width: width,
          height: height,
          top: parseInt( height / 3 ),
          left: parseInt( width / 2 )
        },
        callback: function( token ) {
          this._setToken.call( this, token );
          this._callSaved();
          callback && callback.apply( this, arguments );
        }.bind( this ),
        error: error
      } );
    },

    auth: function( force, callback, error, focus ) {
      if ( force || !this.authorized ) {

        chrome.local.get( {
          key: 'vk'
        }, function( val ) {

          if ( val.vk && val.vk.token && this.isOffline === val.vk.isOffline ) {
            this._setToken.call( this, val.vk.token );
            this._callSaved();
            return callback && callback( val.vk.token );
          }

          this.showWindowAuth( callback, error, false );

        }.bind( this ) )
      }
      return this;
    },

    get authorized() {
      return ( this.token && this.token.length ) &&
        ( this.data.isOffline == this.isOffline );
    }
  };

  _GViK.Add( 'vkapi', new VKAPI );

} );