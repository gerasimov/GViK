/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( gvik, require, Add ) {

    "use strict";

    var

        core = require( 'core' ),
        events = require( 'events' ),
        constants = require( 'constants' ),
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



    var _disc = false;

    function processResponse( data ) {
        trigger( constants.get( "CHROME_RESPONSE" ), data );
    }

    port.onMessage.addListener( processResponse );
    chrome[ CONFIG.sender ].onMessage.addListener( processResponse );

    port.onDisconnect.addListener( function() {
        trigger( constants.get( "CHROME_DISCONNECT" ), {} );
        _disc = true;
    } );


    function connect( name, fn ) {
        document.addEventListener( name, function( e ) {
            fn( e.detail || {} );
        }, false );
    }

    connect( constants.get( "CHROME_REQUEST_SYNC" ), function( data ) {
        sessionStorage[ constants.get( "CHROME_CS_RESPONSE_NAME" ) ] = syncMethods[ data.method ]( data.arg );
    } );


    function cs_request( data ) {
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
    }

    connect( constants.get( "CHROME_REQUEST" ), function( data ) {

        var params = data.params,
            method = methods[ params.method ];

        if ( _disc || method )
            return cs_request( data );

        port.postMessage( data );
    } );

    connect( constants.get( "CHROME_CSREQUEST" ), cs_request );


} );