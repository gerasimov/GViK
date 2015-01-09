/*
 
 
 
 */


_GViK( function( appData, require, Add ) {

    "use strict";


    var event = require( 'event' ),
        core = require( 'core' ),
        dom = require( 'dom' ),
        constants = require( 'constants' ),
        cache = require( 'cache' ),
        sidebar = require( 'sidebar' ),
        global = require( 'global' ),
        chrome = require( 'chrome' );



    var _audiosDownload = {},
        sidebarPage = sidebar.addPage();

    event.bind( "AUDIO_downloaded", function( donwProp ) {
        var data = donwProp.data;
        sidebarPage.tabCont.innerHTML += '<a>' + data.artist + ' - ' + data.title + '</a><br>';
    } );

    chrome.globalFn( 'donwloadChanged', function( s ) {
        console.log( s );
    } );

    sidebarPage.tabCont.classList.add( 'loaded' );



} );