/*
 
 
 
 
 
 */



GViK( function( gvik, require, Add ) {

    "use strict";

    var events = require( 'events' ),
        dom = require( 'dom' ),
        core = require( 'core' ),
        constants = require( 'constants' ),
        msgTxtEl = dom.byClass( 'message-title' ).item( 0 ),
        msgEl = dom.byClass( 'message' ).item( 0 );


    function showMessage( data ) {
        dom.addClass( msgEl, 'show ' + data.type || 'msg' );
        msgTxtEl.innerHTML = data.content;
    }


    if ( localStorage.curId == null )
        core.ajax( {
            'type': 'GET',
            'dataType': 'json',
            'url': 'https://vk.com/feed2.php?act=user'
        }, function( res ) {


            constants.define( 'ID', res.user.id );

            core.define( [  'main.js'], function() {
                events.trigger( 'init' );
            } );

        } );
    else {

        constants.define( 'ID', localStorage.curId );

        core.define( [  'main.js' ], function() {
            events.asyncTrigger( 'init' );
        } );
    }

    dom.setDelegate( document, '[data-href]', 'click', function( el, e ) {
        e.stopPropagation();
        e.preventDefault();

        e._canceled = true;


        chrome.tabs.create( {
            url: el.getAttribute( 'data-href' )
        } )

    } );

} );