/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViKModule.Check( {}, [], function( gvik ) {

    "use strict";

    if ( typeof gvik !== 'undefined' && gvik.DEBUG ) console.log( gvik, gvik.GetConfig )


    var _shown = false,
        cnfg = gvik.GetConfig( 'sidebar' ),

        anim = cnfg.get( 'animation' ) ? 'anim' : '',

        classSidebar = [ anim ].join( ' ' ),


        sidebarEl = gvik.dom.create( 'div', {
            prop: {
                id: 'gvik-sidebar',
                className: classSidebar
            }
        } ),

        switcher = gvik.dom.create( 'span', {
            prop: {
                'className': 'gvik-switcher'
            }
        } ),

        wrap = gvik.dom.create( 'div', {
            prop: {
                id: 'gvik-wrap',
                className: 'style-scrollbar'
            }
        } );

    gvik.dom.append( sidebarEl, [ wrap, switcher ] );

    gvik.dom.appendBody( sidebarEl );

    gvik.event.resize( function( s ) {
        wrap.style[ 'max-height' ] = s.h + 'px';
    } );


    var ontogglestate = function() {
            _shown ?
                gvik.event.trigger( 'SIDEBAR_show' ) :
                gvik.event.trigger( 'SIDEBAR_hide' );
        },

        tabs = [];


    gvik.event
        .on( 'SIDEBAR_show', function() {
            return _shown;
        }, function() {
            if ( tabs.length > 1 )
                tabs.forEach( function( el ) {
                    el.classList.remove( 'gvik-none' );
                } );
        } )
        .on( 'SIDEBAR_hide', function() {
            return !_shown;
        }, function() {
            if ( tabs.length > 1 )
                tabs.forEach( function( el ) {
                    el.classList.add( 'gvik-none' );
                } );
        } );

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

        var nTabCont = gvik.dom.create( 'div', {
            prop: {
                'className': [ 'tabCont', ( countPage > 2 ? 'gvik-none' : '' ) ].join( ' ' )
            }
        } );


        var nSwitcher = gvik.dom.create( 'span', {
            prop: {
                className: [ 'gvik-switcher', ( _shown ? '' : 'gvik-none' ) ].join( ' ' )
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


        return {
            switcher: nSwitcher,
            tabCont: nTabCont,
            wrap: wrap,
            countPage: countPage
        }
    };

    gvik.dom.setEvent( switcher, 'click', sidebar.toggle.bind( sidebar ) );


    GViKModule.Add( {
        sidebar: sidebar
    } );

} );