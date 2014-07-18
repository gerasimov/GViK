/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

"use strict";

;
( function( chromeApi ) {

    var syncMethods = {
            lang: function( e ) {
                return chrome.i18n.getMessage( e );
            }
        },

        PREFIX = 'gvik';

    function processResponse( data ) {
        var eventTrigger = new CustomEvent( 'gvik-response', {
            detail: {
                data: data
            }
        } );
        chromeApi.dispatchEvent( eventTrigger );
    }

    function connect( mname ) {
        for ( var i in mname ) {
            chromeApi.addEventListener( [ PREFIX, i ].join( '-' ), ( function( evn ) {
                return function( e ) {
                    evn( e.detail )
                };
            }( mname[ i ] ) ), false );
        }
    }

    var port = chrome[ CONFIG.sender ].connect();
    port.onMessage.addListener( processResponse );

    chrome[ CONFIG.sender ].onMessage.addListener( processResponse );

    port.onDisconnect.addListener( function() {
        var ev = new CustomEvent( 'gvik-disconnect', {
            detail: {}
        } );

        chromeApi.dispatchEvent( ev );
    } );

    connect( {
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
    } );

}( /*mainElement */ document.documentElement ) );