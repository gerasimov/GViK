/**
 *
 *
 *
 *
 */


_GViK.Init( function( appData, require ) {

    var core = require( 'core' ),
        event = require( 'event' ),
        configs = require( 'configs' ),
        chrome = require( 'chrome' ),
        dom = require( 'dom' );

    appData.getID = function() {
        return window.vk.id;
    };


    var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/,
        rPlugin = /\/([^\/]+)\.js$/,

        _ready = false;

    event.bind( 'init', function() {

        chrome.pushID();

        if ( appData.getID() === 0 ) {
            return setTimeout( function() {
                if ( !_ready )
                    event.trigger( 'init' );
            }, 1000 )
        }

        _ready = true;



        if ( configs.get( 'system', 'enable-qicksett' ) ) {
            event.bind( "changeURL", function() {
                chrome.sendRequest( "showPageAction", {} );
            }, true );
        }


        chrome.ga( 'send', 'event', 'vk', 'init' );


        chrome.local.get( {
            key: 'options'
        }, function( res ) {

            configs.load( res.options );

            core.define( appData.JS_LIST.filter( function( curFileName ) {

                var pluginName = curFileName.match( rNamespacePlugin ) || curFileName.match( rPlugin );

                if ( !pluginName )
                    return true;

                if ( configs.get( pluginName.pop(), 'enable' ) === false )
                    return false;

                return true;

            } ), {
                suffix: appData.VERSION,
                path: appData.APP_PATH
            }, function() {

            } );

        } );
    } );


    if ( dom.byTag( 'body' )
        .item( 0 ) ) {
        event.trigger( 'init' );
    } else {

        dom.setEvent( document, 'DOMContentLoaded', function() {
            if ( !_ready ) event.trigger( 'init' );
        } );

        dom.setEvent( window, 'load', function() {
            if ( !_ready ) event.trigger( 'init' );
        } );

    }



} );