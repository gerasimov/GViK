/**
 *
 *
 *
 *
 */


_GViK( function( appData, require, d ) {

    var core = require( 'core' ),
        event = require( 'event' ),
        options = require( 'options' ),
        constants = require( 'constants' ),
        chrome = require( 'chrome' ),
        dom = require( 'dom' );

    appData.getID = function() {
        return window.vk.id;
    };

    function __init() {

        var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/,
            rPlugin = /\/([^\/]+)\.js$/;

        chrome.local.get( {
            key: 'options'
        }, function( res ) {

            options.load( res.options );

            core.define( appData.JS_LIST.filter( function( curFileName ) {
                var pluginName = curFileName.match( rNamespacePlugin ) || curFileName.match( rPlugin );
                if ( !pluginName ) return true;
                return !( options.get( pluginName.pop(), 'enable' ) === false );
            } ), {
                suffix: appData.VERSION,
                path: appData.APP_PATH,
            } );
        } );
    }

    if ( options.get( 'system', 'enable-qicksett' ) )
        event.bind( "changeURL", function() {
            chrome.sendRequest( "showPageAction", {} );
        }, true );


    chrome.ga( 'send', 'event', 'vk', 'init' );

    event.bind( 'load', function checkID() {
        chrome.pushID();
        if ( appData.getID() === 0 )
            setTimeout( checkID, constants.get( "LOADER_TIMEOUT" ) );
        else
            __init();
    } );

} );