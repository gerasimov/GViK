/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( gvik, require, Add ) {

  "use strict";

  var

    core = require( 'core' ),
    config = require( 'config' ),
    dom = require( 'dom' ),

    syncMethods = {
      lang: function( e ) {
        return chrome.i18n.getMessage( e );
      }
    };

  var port = chrome[ CONFIG.sender ].connect();


  function trigger( evName, data ) {
    document.dispatchEvent(
      new CustomEvent( evName, {
        detail: {
          data: data
        }
      } )
    );
  }

  function processResponse( data ) {
    trigger( config.get( "CHROME_RESPONSE" ), data );
  }

  port.onMessage.addListener( processResponse );
  chrome[ CONFIG.sender ].onMessage.addListener( processResponse );

  port.onDisconnect.addListener( function() {
    trigger( config.get( "CHROME_DISCONNECT" ), {} );
  } );


  function connect( name, fn ) {
    document.addEventListener( name, function( e ) {
      fn( e.detail );
    }, false );
  }

  connect( config.get( "CHROME_REQUEST_SYNC" ), function( data ) {
    sessionStorage[ config.get( "CHROME_CS_RESPONSE_NAME" ) ] = syncMethods[ data.method ]( data.arg );
  } );

  connect( config.get( "CHROME_REQUEST" ), function( data ) {
    port.postMessage( data );
  } );

  connect( config.get( "CHROME_CSREQUEST" ), function( data ) {
    var params = data.params,
      method = methods[ params.method ];

    if ( method )
      method( data.data, params, function() {
        processResponse( {
          arg: core.toArray( arguments ),
          callback: params.callback
        } );
      }, function() {
        processResponse( {
          arg: core.toArray( arguments ),
          callback: params.error
        } );
      } );
  } );


} );