/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK.Init( function( gvik, require ) {

    "use strict";

    var

        core = require( 'core' ),
        dom = require( 'dom' ),

        syncMethods = {
            lang: function( e ) {
                return chrome.i18n.getMessage( e );
            }
        },

        chromeApiElement = document.documentElement,

        PREFIX = 'gvik';


    function trigger( name, data ) {
        var eventTrigger = new CustomEvent( name, {
            detail: {
                data: data
            }
        } );
        chromeApiElement.dispatchEvent( eventTrigger );
    }

    function processResponse( data ) {
        trigger( 'gvik-response', data );
    }

    var port = chrome[ CONFIG.sender ].connect();
    port.onMessage.addListener( processResponse );

    chrome[ CONFIG.sender ].onMessage.addListener( processResponse );

    port.onDisconnect.addListener( function() {
        trigger( 'gvik-disconnect', {} );
    } );

    core.each( {
        callSync: function( data ) {
            sessionStorage[ 'gvik-result' ] = syncMethods[ data.method ]( data.arg );
        },

        call: function( data ) {
            port.postMessage( data )
        },

        callCS: function( data ) {
            var params = data.params,
                method = methods[ params.method ];

            method && method( data.data, params, function() {
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
        }
    }, function( fn, name ) {
        chromeApiElement.addEventListener( [ PREFIX, name ].join( '-' ), function( e ) {
            fn( e.detail )
        }, false );
    } );

} );