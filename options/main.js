/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

_GViK( function( gvik, require, Add ) {


    "use strict";

    var storage = require( 'storage' ),
        event = require( 'event' ),
        core = require( 'core' ),
        dom = require( 'dom' ),
        lastfmAPI = require( 'lastfmAPI' ),
        options = require( 'options' ),
        vkapi = require( 'vkapi' ),
        _chrome = require( 'chrome' );


    //document.body.classList.add('night-mode');

    if ( location.search ) {
        var locArg = core.toObject( core.map( location.search.slice( 1 )
            .split( '&' ),
            function( v, k ) {
                return v.split( '=' );
            } ) );

        dom.setAttr( document.body, locArg );
    }

    var bg = chrome.extension.getBackgroundPage(),
        els = document.querySelectorAll( 'input:not([type="button"]), select' ),

        ischeckedpropreg = /^(?:radio|checkbox)$/;


    bg.ga( 'send', 'pageview', '/options.html' );



    function restore( setts ) {
        core.each( setts, function( _v, _k ) {
            core.each( _v, function( optVal, optName, elem ) {
                if ( !( elem = document.getElementById( _k + '-' + optName ) ) )
                    return;

                var prop = ischeckedpropreg.test( elem.type ) ? "checked" : "value";
                elem[ prop ] = optVal;
            } );
        } );
    }


    core.each( document.querySelectorAll( '[i18n-content]' ), function( el ) {

        var res = chrome.i18n.getMessage( el.getAttribute( 'i18n-content' ) ),
            propName = 'innerHTML';

        if ( el.tagName == 'INPUT' ) {
            if ( ischeckedpropreg.test( el.type ) ) {
                el.setAttribute( 'data-i18n', res );
                return;
            } else {
                propName = 'value';
            }
        }


        el[ propName ] = res;
    } );

    _chrome.local.get( {
        key: 'options'
    }, function( _ ) {

        restore( options.load( _.options || {} ) );

        document.body.classList.add( 'show' );


    } );


    var _trigger = function( el ) {



        var elId = el.id.split( '-' ),

            namespace = elId.shift(),
            optName = elId.join( '-' ),
            optVal = ischeckedpropreg.test( el.type ) ?
            el.checked :
            el.value;


        event.trigger( 'change_option', {
            namespace: namespace,
            optName: optName,
            optVal: optVal
        } );
    };

    event.bind( 'change_option', function( data ) {

        options.set( data.namespace,
            data.optName,
            data.optVal );

        _chrome.local.set( {
            options: options.options
        } );
    } );


    dom.setDelegate( document, {
        'input[type=checkbox], input[type=number], select': {
            change: _trigger
        },
        'input[type=radio]': {
            change: function( el ) {

                console.log( dom.queryAll( 'input[type=radio][name=' + el.name + ']', dom.parent( el, '.hidden-el' ) ) );
                core.each( dom.queryAll( 'input[type=radio][name=' + el.name + ']', dom.parent( el, '.hidden-el' ) ), _trigger );
            }
        },
        'input[type=text]': {
            keyup: _trigger
        }
    } );


} );