/*
 
 
 
 
 
 */



_GViK( function( gvik, require, Add ) {

    "use strict";

    var event = require( 'event' ),
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

            core.define( 'ui.js', 'main.js', function() {
                event.trigger( 'init' );
            } );
        } );
    else {

        constants.define( 'ID', localStorage.curId );

        core.define( [ 'ui.js', 'main.js' ], function() {
            event.asyncTrigger( 'init' );
        } );
    }



} );