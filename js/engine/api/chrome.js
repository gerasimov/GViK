/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( appData, require, Add ) {

  "use strict";


  var

    core = require( 'core' ),
    config = require( 'config' ),
    event = require( 'event' ),

    disconnected = false;


  function connect( evName, fn ) {
    document.addEventListener( evName, function( e ) {
      var data = {};

      if ( e.detail ) {
        data = e.detail.data;
      }

      fn( data, e );
    }, false );
  }

  connect( config.get( "CHROME_RESPONSE" ), function( data ) {
    if ( has( data.callback ) ) {
      get( data.callback )
        .apply( this, data.arg );

      remove( data.callback );
      remove( data.error );
    }
  } );

  connect( config.get( "CHROME_DISCONNECT" ), function() {
    disconnected = true;
    event.trigger( 'disconnect' );
  } );

  var callbackContainer = [
      function() {
        var args = core.toArray( arguments );
        args.unshift( 'defaultFn' );
      }
    ],

    defaultFn = 0;

  function makeFnId( fn ) {

    if ( !fn ) {
      return defaultFn;
    }

    return callbackContainer.push( fn ) - 1;
  }

  function get( fnId ) {
    return callbackContainer[ fnId ];
  }

  function has( fnId ) {
    return callbackContainer[ fnId ] !== undefined;
  }

  function remove( fnId ) {
    callbackContainer[ fnId ] = undefined;
  }

  var _chrome = {
    get disconnected() {
      return disconnected;
    }
  };

  function sendRequest( method, sys, callback, error ) {

    var params = sys.params || {},
      callName = disconnected || sys.forceCS ? config.get( "CHROME_CSREQUEST" ) : config.get( "CHROME_REQUEST" ),
      eventTrigger;

    params.uid = appData.getID();
    params.callback = makeFnId( sys.callback || callback );
    params.error = makeFnId( sys.error || error );
    params.method = method;

    var customEvent = new CustomEvent( callName, {
      detail: {
        data: sys.data,
        params: params
      },
      bubbles: false
    } );

    document.dispatchEvent( customEvent );

    return _chrome;
  }
  _chrome.sendRequest = sendRequest;


  _chrome.simpleAjax = _chrome.ajax = function( data, callback, error ) {

    return sendRequest( 'simpleAjax', {
      data: data,
      callback: callback,
      error: error,
      forceCS: config.get( "CHROME_FORCE_CS_RUN" )
    } );
  };

  _chrome.abortAjax = function( xhrId, callback, error ) {

    return sendRequest( 'abortAjax', {
      data: {
        xhrId: xhrId
      },
      callback: callback,
      error: error,
      forceCS: config.get( "CHROME_FORCE_CS_RUN" )
    } );
  };

  _chrome.abortAllAjax = function(  callback, error ) {

    return sendRequest( 'abortAllAjax', {
      data: { },
      callback: callback,
      error: error,
      forceCS: config.get( "CHROME_FORCE_CS_RUN" )
    } );
  };

  _chrome.pushID = function( callback, error ) {
    return sendRequest( 'pushID', {
      callback: callback,
      error: error
    } );
  };

  _chrome.sendTabs = function( eventName, data, needCur, callback, error ) {
    return sendRequest( 'sendTabs', {
      data: data,
      params: {
        eventName: eventName,
        needCur: needCur
      },
      callback: callback,
      error: error
    } );
  };

  _chrome.sendEvent = function( events ) {
    return sendRequest( 'sendEvent', {
      data: {
        events: events
      }
    } );
  };

  function sendRequestSync( method, arg ) {
    var customEvent = new CustomEvent( config.get( "CHROME_REQUEST_SYNC" ), {
      detail: {
        method: method,
        arg: arg
      },
      bubbles: true
    } );

    document.dispatchEvent( customEvent );

    return sessionStorage[ config.get( "CHROME_CS_RESPONSE_NAME" ) ];
  }

  _chrome.globalFn = function( key, fn, context ) {
    callbackContainer[ key ] = context ? fn.bind( context ) : fn;
    return this;
  };

  function setStorageitem( vals, callback, storageName ) {
    var data = {};

    core.each( vals, function( val, key ) {
      data[ ( key + '::' + appData.getID() ) ] = val;
    } );

    return sendRequest( storageName, {
      data: data,
      params: {
        forceCS: true
      },
      callback: callback
    } );
  }

  function getStorageitem( obj, callback, storageName ) {

    var key = obj.key ?
      ( obj.key + '::' + appData.getID() ) :
      null;

    return sendRequest( storageName, {
      data: {
        key: key
      },
      params: {
        forceCS: true
      },
      callback: function( vals ) {
        var result = core.toObject( core.map( vals, function( res, key ) {
          return [ key.split( '::' ).slice( 0, -1 ).join( '::' ), res ];
        } ) );

        callback( result );
      }
    } );
  }

  function removeStorageitem( key, callback, storageName ) {
    return sendRequest( storageName, {
      data: {
        key: key + '::' + appData.getID()
      },
      params: {
        forceCS: true
      }
    } );
  }

  _chrome.lang = function( word ) {
    return sendRequestSync( 'lang', word );
  };



  core.each( [ 'Sync', 'Local' ], function( storageName ) {
    _chrome[ storageName.toLowerCase() ] = {};
    core.each( {
      get: getStorageitem,
      set: setStorageitem,
      remove: removeStorageitem
    }, function( storFn, storFnName ) {
      _chrome[ storageName.toLowerCase() ][ storFnName ] = function( f, s ) {
        return storFn( f, s, storFnName + storageName );
      };
    } );
  }, true );


  _chrome.download = {
    download: function( data, callback ) {
      return sendRequest( 'download', {
        data: data,
        callback: callback
      } );
    },

    search: function( itemId, fn, err ) {
      return sendRequest( 'search', {
        data: {
          id: itemId
        }
      }, fn, err )
    },
    downloadFromCache: function( data, callback ) {
      return sendRequest( 'downloadFromCache', {
        data: data,
        callback: callback
      } );
    }
  };


  _chrome.tabs = {
    open: function( url, obj, params, clb ) {

      params = params || {};

      if ( !params.chrome && !/https?\:\/\//.test( url ) ) {
        url = location.origin + '/' + url;
      }

      return sendRequest( 'tabsOpen', {
        data: core.extend( {
          url: url,
          active: true
        }, obj || {} ),
        params: params
      }, clb );
    },
    update: function( clb ) {
      return sendRequest( 'tabsUpdate', {

      }, clb );
    },

    close: function( clb ) {
      return sendRequest( 'tabsClose', {

      }, clb );
    }
  };

  _chrome.getSupport = function( callback ) {
    return sendRequest( 'getSupport', {}, callback );
  };



  _chrome.ga = function() {
    return sendRequest( 'ga', {
      data: {
        arg: core.toArray( arguments )
      }
    } );
  };


  Add( 'chrome', _chrome );



} );