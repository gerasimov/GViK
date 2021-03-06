/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK( function( gvik, require, Add ) {

    var options = require( 'options' ),
        dom = require( 'dom' ),
        chrome = require( 'chrome' ),
        vkapi = require( 'vkapi' ),
        global = require( 'global' ),
        events = require( 'events' ),
        constants = require( 'constants' ),
        core = require( 'core' );


    dom.setData( document.body, {
        'gvik-os': gvik.OS,
        'gvik-options': core.filter( {
                'audio-out-hide': '_hide-bit_',
                'common-remove-ads': '_ads_',
                'common-remove-white-heart': '_heart_'
            }, function( v, k ) {
                var keys = k.split( /-/g );
                return !options.get( keys.shift(), keys.join( '-' ) );
            } )
            .join( '' )
    } );


    if ( options.get( 'common', 'state-onlineChange' ) ) {

        if ( options.get( 'common', 'set-offline' ) ) {
            events.bind( 'changePage', function() {
                vkapi.call( 'account.setOffline' );
            }, true );

        } else if ( options.get( 'common', 'set-online' ) ) {
            ( function() {
                var fn = arguments.callee;
                vkapi.call( 'account.setOnline', {}, function() {
                    setTimeout( fn, ( 14 * 60 ) * 1000 );
                } );
            }() );
        }
    }

    if ( options.get( 'wall', 'disable-wide' ) ) {

        var blockedClasses = [
            'wide_wall_module',
            'page_wide_no_narrow'
        ];

        window.addClass = function( obj, name ) {
            if ( blockedClasses.indexOf( name ) === -1 )
                if ( ( obj = ge( obj ) ) && !hasClass( obj, name ) ) {
                    obj.className = ( obj.className ? obj.className + ' ' : '' ) + name;
                }
        };

        core.each( blockedClasses, function( cls ) {
            var els = dom.byClass( cls );
            core.each( els, function( el ) {
                dom.removeClass( el, cls );
            } );
        } );

    }
 

    window.rs = core.tmpl3;

} );