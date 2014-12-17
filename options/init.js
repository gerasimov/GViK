/*





 */



_GViK.Init( function( gvik, require ) {

    "use strict";

    var event = require( 'event' ),
        dom = require( 'dom' ),
        core = require( 'core' ),
        msgTxtEl = dom.byClass( 'message-title' ).item(0),
        msgEl = dom.byClass( 'message' ).item(0);


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

            gvik.__ID = res.user.id;

            core.define( 'main.js', function() {
                event.trigger( 'init' );
            } );
        } );
    else {

        if ( localStorage.curId == '0' ) {
            showMessage( {
                type: 'error',
                content: 'Нужно залогиниться в VK'
            } );
        } else {
            gvik.__ID = localStorage.curId;

            core.define( 'main.js', function() {
                event.trigger( 'init' );
            } );
        }
    }



} );