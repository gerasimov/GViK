/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

_GViK.Init( {
    'sidebar': 'enable'
}, [], function( gvik, require ) {

    "use strict";


    var
        dom = require( 'dom' ),
        core = require( 'core' ),
        event = require( 'event' ),


        _shown = false,
        cnfg = gvik.configs.get( 'sidebar' ),

        anim = cnfg.get( 'animation' ) ? 'anim' : '',

        classSidebar = [ anim ].join( ' ' ),


        sidebarEl = dom.create( 'div', {
            prop: {
                id: 'gvik-sidebar',
                className: classSidebar
            }
        } ),

        switcher = dom.create( 'span', {
            prop: {
                'className': 'gvik-switcher'
            }
        } ),

        wrap = dom.create( 'div', {
            prop: {
                id: 'gvik-wrap',
                className: 'style-scrollbar'
            }
        } );

    dom.append( document.body,
        dom.append( sidebarEl, [
            wrap,
            switcher
        ] )
    );

    event.bind( 'resize', function( s ) {
        wrap.style[ 'max-height' ] = s.h + 'px';
    }, true );


    var ontogglestate = function() {
            event.trigger( _shown ? 'SIDEBAR_show' : 'SIDEBAR_hide' );
        },

        tabs = [];


    var sidebar = {
        get shown() {
            return _shown;
        },
        set shown( state ) {
            if ( typeof state !== 'boolean' || _shown === state ) {
                return;
            }

            ( _shown = state ) ?
                sidebarEl.classList.add( 'show' ) :
                sidebarEl.classList.remove( 'show' );

            ontogglestate();
        }
    };


    sidebar.show = function() {
        this.shown = true;
    };

    sidebar.hide = function() {
        this.shown = false;
    };

    sidebar.toggle = function() {
        this.shown = !this.shown;
    };

    sidebar.toggleSize = function() {
        sidebarEl.classList.toggle( 'large' );
    }

    var countPage = sidebar.countPage = 1,
        heightTab = 31,
        offset = heightTab + ( countPage * heightTab ),
        lastTabC;

    sidebar.addPage = function( callback ) {

        countPage += 1;

        var nTabCont = dom.create( 'div', {
            prop: {
                'className': [ 'tabCont', ( countPage > 2 ? 'gvik-none' : '' ) ].join( ' ' )
            }
        } );


        var nSwitcher = dom.create( 'span', {
            prop: {
                className: [ 'gvik-switcher', 'additional', ( _shown ? '' : 'gvik-none' ) ].join( ' ' )
            },
            style: {
                top: offset + 'px'
            },

            events: {
                mousedown: function() {
                    lastTabC.classList.add( 'gvik-none' );
                    nTabCont.classList.remove( 'gvik-none' );
                    lastTabC = nTabCont;
                }
            }
        } );

        tabs.push( nSwitcher );

        offset += heightTab;

        if ( countPage === 2 ) {
            lastTabC = nTabCont;
        }

        callback( nSwitcher, nTabCont, wrap, countPage );

        wrap.style.minHeight = nTabCont.minHeight = offset + 'px';


        sidebarEl.appendChild( nSwitcher );
        wrap.appendChild( nTabCont );

        core.each( wrap.children, function( el ) {
            el.style.minHeight = offset + 'px';
        } );

        return {
            switcher: nSwitcher,
            tabCont: nTabCont,
            wrap: wrap,
            countPage: countPage
        }
    };

    dom.setEvent( switcher, 'click', sidebar.toggle.bind( sidebar ) );


    _GViK.Add( 'sidebar', sidebar );

} );