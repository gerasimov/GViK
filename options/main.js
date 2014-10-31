/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

_GViK.Init( function( gvik, require ) {

    "use strict";



    var core = require( 'core' ),
        dom = require( 'dom' );



    //document.body.classList.add('night-mode');

    if ( location.search ) {
        var locArg = core.toObject( core.map( location.search.slice( 1 )
            .split( '&' ), function( v, k ) {
                return v.split( '=' );
            } ) );

        dom.setAttr( document.body, locArg );
    }

    var els = document.querySelectorAll( '#opt input:not([type="button"]), #opt select' ),
        DEFAULT_CONFIGS = JSON.parse( core.getResource( 'configs.json' ) ),
        msg = document.querySelector( '.message' ),
        lastTabCont = document.querySelector( '.tab-content.active' ),
        tabsCont = document.querySelectorAll( '.tab-content' ),
        tabs = document.querySelectorAll( '.nav input' ),
        ischeckedpropreg = /^(?:radio|checkbox)$/;


    function hideMsg() {
        msg.classList.remove( 'show' );
    }

    function showMsg() {
        msg.classList.add( 'show' );
    }

    function save() {
        var opt = getSett();

        opt.common.lastSaved = Date.now();

        chrome.storage.local.set( {
            options: opt
        }, function() {
            showMsg();
        } );
    }

    function restore( setts ) {
        core.each( setts, function( _v, _k ) {
            core.each( _v, function( optVal, optName, elem ) {
                if ( ( elem = document.getElementById( _k + '-' + optName ) ) )
                    ischeckedpropreg.test( elem.type ) ?
                    ( elem.checked = optVal ) :
                    ( elem.value = optVal );
            } );
        } );
    }

    function getSett() {
        var setts = {};

        core.each( els, function( el ) {
            var elId = el.id.split( '-' ),
                namespace = elId.shift(),
                optName = elId.join( '-' );

            if ( !setts.hasOwnProperty( namespace ) ) {
                setts[ namespace ] = {};
            }

            setts[ namespace ][ optName ] = ischeckedpropreg.test( el.type ) ?
                el.checked :
                el.value;
        } );
        return setts;
    };

    core.each( document.querySelectorAll( '[i18n-content]' ), function( el ) {

        var res = chrome.i18n.getMessage( el.getAttribute( 'i18n-content' ) );
        var propName = 'innerHTML';

        if ( el.tagName == 'INPUT' ) {
            if ( ischeckedpropreg.test( el.type ) ) {
                el.setAttribute( 'data-i18n', res );
                return;
            } else {
                propName = 'value';
            }
        }


        el[ propName ] = res
    } );

    chrome.storage.local.get( 'options', function( _ ) {

        var options = {},
            curOptions = _.options || {};

        if ( core.isEmpty( curOptions ) ) {
            return restore( DEFAULT_CONFIGS );
        }

        core.each( DEFAULT_CONFIGS, function( val, key ) {
            options[ key ] = {};

            if ( curOptions[ key ] == null ) {
                options[ key ] = val;
                return;
            }

            core.each( val, function( v, k ) {
                options[ key ][ k ] = ( curOptions[ key ] && curOptions[ key ].hasOwnProperty( k ) ) ?
                    curOptions[ key ][ k ] :
                    v;
            } );
        } );

        restore( options );

    } );


    dom.setEvent( document.getElementById( 'restore-defaults' ), 'click', function() {
        chrome.storage.local.remove( 'options' );
        location.reload();
    } );


    core.each( tabs, function( el, id, isEnd ) {
        dom.setEvent( el, 'change', function() {
            lastTabCont.classList.remove( 'active' );
            ( lastTabCont = tabsCont[ id ] )
                .classList.add( 'active' );
        } );
    }, true );


    dom.setDelegate( document, {
        '#opt input[type=checkbox], #opt input[type=number], #opt input[type=radio], #opt select': {
            'change': save
        },
        '#opt input[type=text]': {
            'keyup': save
        }
    } );

} );