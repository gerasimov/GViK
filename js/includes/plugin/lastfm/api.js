/**
 *
 *
 *
 *
 */

<<<<<<< HEAD
GViK( function( gvik, require, add ) {

  'use strict';

  var chrome = require( 'chrome' );
  var md5 = require( 'md5' );
  var storage = require( 'storage' );
  var events = require( 'events' );
  var core = require( 'core' );

  function LastFMAPI() {

    var token = location.href.match( /\?token\=(\w+)\#gvik_lastfm/ );

    if ( token ) {

      try {
        history.pushState( {}, '', location.pathname );
      } catch ( e ) {}

      this.getSession( token[ 1 ], function( res ) {
=======
GViK(function(gvik, require, add) {

  'use strict';

  var chrome = require('chrome');
  var md5 = require('md5');
  var storage = require('storage');
  var events = require('events');
  var core = require('core');

  function LastFMAPI() {

    var token = location.href.match(/\?token\=(\w+)\#gvik_lastfm/);

    if (token) {

      try {
        history.pushState({}, '', location.pathname);
      } catch (e) {}

      this.getSession(token[ 1 ], function(res) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

        var response = {
          sk: res.session.key,
          name: res.session.name,
          state: true
        };

<<<<<<< HEAD
        this.setConfig( response );

        chrome.sync.set( {
          lastfm: response
        } );

        events.trigger( 'LASTFM_connect', response );

      }.bind( this ) );
    }

  }

  LastFMAPI.prototype = {
    get data() {
      return storage.local.getJson( 'lastfm' ) || {};
    },

    setConfig: function( param ) {
      return storage.local.setJson( 'lastfm', core.extend( {}, this.data, param ) );
    },

    get sessionKey() {
      return this.data.sk;
    },

    get name() {
      return this.data.name;
    },

    get state() {
      return this.data.state;
    },

    get ROOT_URL() {
      return 'https://ws.audioscrobbler.com/2.0/';
    },

    get KEY() {
      return 'ec0478e7bd7a9fd3c8b44bf9672bf6b2';
    },

    get SECRET() {
      return '191c6d3f39d3c59f28b7305b05d08772';
    },

    get authorized() {
      return !!( this.sessionKey && this.name );
    },

    getSignature: function( params ) {
      return md5( core.map( params, function( v, k ) {
          return k + v;
        } )
        .sort()
        .join( '' ) + this.SECRET );
    },

    _errorCode: {
      '9': function() {
        storage.local.remove( 'lastfm' );
        chrome.sync.remove( 'lastfm' );

        chrome.sendTabs( 'LASTFM_changestate', {
          data: false
        }, 1 );

        this.auth();
      },

      '6': function() {}
    },

    call: function( method, data, _callback, _error ) {

      data = data || {};

      if ( this.sessionKey ) {
        data.sk = this.sessionKey;
      }

      core.extend( data, {
        lang: 'ru',
        method: method,
        api_key: this.KEY
      } );

      data.api_sig = this.getSignature( data );
      data.format = 'json';

      return chrome.simpleAjax( {
          type: 'POST',
          url: this.ROOT_URL,
          dataType: 'json',
          data: data
        }, function( response ) {
          var errCode = response.error,
            errFn = this._errorCode[ errCode ];

          if ( errCode ) {
            if ( errFn ) {
              errFn.call( this );
            }
            return _error && _error.call( this, response );
          }

          _callback( response );
        }.bind( this ), ( function() {
          return _error.apply( this, arguments );
        } )
        .bind( this ) );

    },

    _call: function( method, params, callback, error, prop ) {
      this.call( method, params, function( res ) {
        if ( res.hasOwnProperty( prop ) || core.isEmpty( res ) ) {
          return callback.apply( this, arguments );
        }

        if ( typeof error === 'function' ) {
          return error.apply( this, arguments );
        }
      }, error );
      return this;
    },

    getSession: function( token, callback, error ) {
      this._call( 'auth.getSession', {
        token: token
      }, callback, error, 'session' );
      return this;

    },

    auth: function() {

      chrome.sync.get( {
        key: 'lastfm'
      }, function( vals, key ) {

        if ( !vals.lastfm || !vals.lastfm.sk ) {
          return chrome
            .tabs.open( 'http://www.last.fm/api/auth/?api_key=' + this.KEY );
        }

        this.setConfig( vals.lastfm );

        chrome.sync.set( {
            lastfm: vals.lastfm
          } )
          .sendTabs( 'LASTFM_enablebutton', null )
          .sendTabs( 'LASTFM_changestate', {
            data: true
          } );

      }.bind( this ) );
      return this;
    },

    scrobble: function( arg, callback, error ) {
      return this._call( 'track.scrobble', arg, callback, error, 'scrobbles' );
    },

    update: function( arg, callback, error ) {
      return this._call( 'track.updateNowPlaying', arg, callback, error, 'nowplaying' );
    },

    love: function( arg, callback, error ) {
      return this._call( 'track.love', arg, callback, error, 'status' );
    },

    unlove: function( arg, callback, error ) {
      return this._call( 'track.unlove', arg, callback, error, 'status' );
    },

    getLoved: function( arg, callback, error ) {
      return this._call( 'user.getLovedTracks', arg, callback, error, 'lovedtracks' );
    }
  };

  add( 'lastfmAPI', new LastFMAPI() );
=======
        this.setConfig(response);

        chrome.sync.set({
          lastfm: response
        });

        events.trigger('LASTFM_connect', response);

      }.bind(this));
    }

  }

  LastFMAPI.prototype = {
    get data() {
      return storage.local.getJson('lastfm') || {};
    },

    setConfig: function(param) {
      return storage.local.setJson('lastfm', core.extend({}, this.data, param));
    },

    get sessionKey() {
      return this.data.sk;
    },

    get name() {
      return this.data.name;
    },

    get state() {
      return this.data.state;
    },

    get ROOT_URL() {
      return 'https://ws.audioscrobbler.com/2.0/';
    },

    get KEY() {
      return 'ec0478e7bd7a9fd3c8b44bf9672bf6b2';
    },

    get SECRET() {
      return '191c6d3f39d3c59f28b7305b05d08772';
    },

    get authorized() {
      return !!(this.sessionKey && this.name);
    },

    getSignature: function(params) {
      return md5(core.map(params, function(v, k) {
        return k + v;
      })
      .sort()
      .join('') + this.SECRET);
    },

    _errorCode: {
      '9': function() {
        storage.local.remove('lastfm');
        chrome.sync.remove('lastfm');

        chrome.sendTabs('LASTFM_changestate', {
          data: false
        }, 1);

        this.auth();
      },

      '6': function() {}
    },

    call: function(method, data, _callback, _error) {

      data = data || {};

      if (this.sessionKey) {
        data.sk = this.sessionKey;
      }

      core.extend(data, {
        lang: 'ru',
        method: method,
        api_key: this.KEY
      });

      data.api_sig = this.getSignature(data);
      data.format = 'json';

      return chrome.simpleAjax({
        type: 'POST',
        url: this.ROOT_URL,
        dataType: 'json',
        data: data
      }, function(response) {
        var errCode = response.error,
            errFn = this._errorCode[ errCode ];

        if (errCode) {
          if (errFn) {
            errFn.call(this);
          }
          return _error && _error.call(this, response);
        }

        _callback(response);
      }.bind(this), (function() {
        return _error.apply(this, arguments);
      })
      .bind(this));

    },

    _call: function(method, params, callback, error, prop) {
      this.call(method, params, function(res) {
        if (res.hasOwnProperty(prop)) {
          return callback.apply(this, arguments);
        }

        if (typeof error === 'function') {
          return error.apply(this, arguments);
        }
      }, error);
      return this;
    },

    getSession: function(token, callback, error) {
      this._call('auth.getSession', {
        token: token
      }, callback, error, 'session');
      return this;

    },

    auth: function() {

      chrome.sync.get({
        key: 'lastfm'
      }, function(vals, key) {

        if (!vals.lastfm || !vals.lastfm.sk) {
          return chrome
              .tabs.open('http://www.last.fm/api/auth/?api_key=' + this.KEY);
        }

        this.setConfig(vals.lastfm);

        chrome.sync.set({
          lastfm: vals.lastfm
        })
        .sendTabs('LASTFM_enablebutton', null)
        .sendTabs('LASTFM_changestate', {
                      data: true
                    });

      }.bind(this));
      return this;
    },

    scrobble: function(arg, callback, error) {
      return this._call('track.scrobble', arg, callback, error, 'scrobbles');
    },

    update: function(arg, callback, error) {
      return this._call('track.updateNowPlaying', arg, callback, error, 'nowplaying');
    },

    love: function(arg, callback, error) {
      return this._call('track.love', arg, callback, error, 'status');
    },

    unlove: function(arg, callback, error) {
      return this._call('track.unlove', arg, callback, error, 'status');
    },

    getLoved: function(arg, callback, error) {
      return this._call('user.getLovedTracks', arg, callback, error, 'lovedtracks');
    }
  };

  add('lastfmAPI', new LastFMAPI());
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

});
