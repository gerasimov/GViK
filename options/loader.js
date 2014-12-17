/*




 */


_GViK.Init( function( gvik, require ) {

    "use strict";


    require( 'core' ).define( [
        '/js/engine/dom.js',
        '/js/engine/events.js',

        '/js/engine/configs.js',
        '/js/engine/storage.js',
        '/js/engine/api/support.js',
        '/js/engine/api/methods.js',
        '/js/engine/api/port/content.js',
        '/js/engine/api/chrome.js',

        "ui.js",
        "init.js"
    ] );

} );