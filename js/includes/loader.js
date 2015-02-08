/**
 *
 *
 *
 *
 */


_GViK( function( appData, require ) {


    var core = require( 'core' ),
        events = require( 'events' ),
        options = require( 'options' ),
        constants = require( 'constants' ),
        chrome = require( 'chrome' ),
        dom = require( 'dom' );



    function __init() {

        var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/,
            rPlugin = /\/([^\/]+)\.js$/;

        constants.define( 'ID', window.vk.id );


        if ( options.get( 'system', 'enable-qicksett' ) )
            events.bind( "changeURL", function() {
                chrome.sendRequest( "showPageAction", {} );
            }, true );


        chrome
            .pushID()
            .ga( 'send', 'event', 'vk', 'init' )
            .local.get( {
                key: 'options'
            }, function( res ) {

                options.load( res.options );

                core.define( core.filter( appData.JS_LIST, function( curFileName ) {
                    var pluginName = curFileName.match( rNamespacePlugin ) || curFileName.match( rPlugin );
                    if ( !pluginName )
                        return true;
                    return !( options.get( pluginName.pop(), 'enable' ) === false );
                } ), {
                    suffix: appData.VERSION,
                    path: appData.APP_PATH,
                } );
            } );
    }



    events.bind( 'load', function() {

        if ( window.vk.id === 0 )
            setTimeout( arguments.callee, constants.get( "LOADER_TIMEOUT" ) );
        else {
            __init();
        }
    } );

} );