/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

"use strict";

var appPath = chrome.extension.getURL( '' ),
    manifest = SUPPORT.runtime ?
    chrome.runtime.getManifest() :
    JSON.parse( core.getResource( 'manifest.json' ) ),

    mainElement = dom.create( 'script', {
        prop: {
            async: true,
            src: [ appPath, 'js/init.js?', manifest.version ].join( '' )
        },
        events: {
            load: function() {
                this.parentNode.removeChild( this );
            }
        }
    } );

core.extend( sessionStorage, {
    manifest: JSON.stringify( manifest ),
    apppath: appPath,
    appid: appPath.split( /\/+/ )[ 1 ],
    configs: core.getResource( 'configs.json' )
} );

chrome.storage.local.get( 'options', function( val ) {
    sessionStorage.options = JSON.stringify( val.options || {} );
    document.documentElement.appendChild( mainElement );
} );