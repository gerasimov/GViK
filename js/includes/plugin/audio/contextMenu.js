_GViK.Init( function( gvik, require ) {

    "use strict";

    var dom = require( 'dom' ),
        storage = require( 'storage' ),
        core = require( 'core' );



    var tid,

        rect = dom.create( 'div', {
            style: {
                width: '175px',
                height: '180px',
                position: 'absolute',
                'z-index': 4444,
                display: 'none',
                background: ' rgb(229, 229, 229)',
                border: '1px solid black'
            },

            events: {
                mouseout: function() {
                    if ( !tid )
                        tid = setTimeout( function() {
                            setPos( 0, 0, 'none' );
                        }, 300 );
                },

                mouseover: function() {
                    if ( tid ) {
                        clearTimeout( tid );
                        tid = null;
                    }
                },

                mouseup: function() {
                    setPos( 0, 0, 'none' );
                }
            }
        } );

    function setPos( x, y, disp ) {

        core.extend( rect.style, {
            display: disp,
            top: y + "px",
            left: x + "px"
        } );

    }


    dom.append( document.body, rect );


    dom.setDelegate( document, '.audio', [
                        'contextmenu',
                        'click'
                    ], function( el, e ) {
        if( !e.ctrlKey )
            return;

        e.stopPropagation();
        e.preventDefault();


        setPos( e.x - 2, ( e.y ) - 2, 'block' );
        rect.innerText = el.getElementsByTagName( 'b' ).item( 0 ).innerText;

        return false;
    } );



} );