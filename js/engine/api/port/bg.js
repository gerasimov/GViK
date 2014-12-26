/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( gvik, require, Add ) {

  "use strict";


  var core = require( 'core' );

  chrome[ CONFIG.sender ].onConnect.addListener( function( port ) {

    port.onMessage.addListener( function( data ) {
      var params = data.params,
        method = methods[ params.method ];


      if ( port.sender.tab ) {
        params.tabId = port.sender.tab.id;
      }

      if ( method )
        method( data.data, params, function() {
          port.postMessage( {
            arg: core.toArray( arguments ),
            callback: params.callback
          } );
        }, function() {
          port.postMessage( {
            arg: core.toArray( arguments ),
            callback: params.error
          } );
        } );
    } );

  } );


} );