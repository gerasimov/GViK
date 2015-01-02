/*



 */


_GViK( function( appData, require, Add ) {

    "use strict";


    var event = require( 'event' ),
        core = require( 'core' ),
        dom = require( 'dom' ),
        config = require( 'config' ),
        cache = require( 'cache' ),
        sidebar = require('sidebar'),
        global = require( 'global' ),
        chrome = require( 'chrome' );



    var _audiosDownload = {};


    event.bind( "AUDIO_downloaded", function( data ) {
        if ( _audiosDownload[ data.id ] )
            _audiosDownload[ data.id ]( data );
    } );

 


    sidebar.addPage(function() {

    });

} );