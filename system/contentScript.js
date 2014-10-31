/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

"use strict";


_GViK.Init( function( gvik, require ) {

    var dom = require( 'dom' ),
        core = require( 'core' ),

        appPath = chrome.extension.getURL( '' ),
        manifest = SUPPORT.runtime ?

        chrome.runtime.getManifest() :
        JSON.parse( core.getResource( 'manifest.json' ) ),

        script = dom.create( 'script', {
            prop: {
                src: [ appPath, 'js/init.js?', manifest.version ].join( '' )
            }
        } );


    var opt = {
        apppath: appPath,
        manifest: JSON.stringify( manifest ),
        appid: appPath.split( /\/+/ )[ 1 ]
    };

    chrome.storage.local.get( 'options', function( val ) {
        opt.options = JSON.stringify( val.options || {} );
        core.extend( sessionStorage, opt );

        ( function initfn() {
            var head = document.head;

            if ( !head ) {
                return setTimeout( initfn, 15 );
            }

            head.appendChild( script );

        }() );

        
    } );
} );