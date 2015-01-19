/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK( {
    'groups': 'fast-exit'
}, function( gvik, require, Add ) {

    'use strict';

    var options = require( 'options' ),
        dom = require( 'dom' ),
        chrome = require( 'chrome' ),
        vkapi = require( 'vkapi' ),
        event = require( 'event' ),
        core = require( 'core' );


    event.bind( 'groups', function() {

        var el = dom.byId( 'groups_list_summary' );

        if ( !el ) 
            return;

        dom.append( el, [

            dom.create( 'span', {
                prop: {
                    className: 'divider',
                    innerText: '|'
                }
            } ),

            dom.create( 'span', {
                append: dom.create( 'a', {
                    prop: {
                        innerText: 'Выйти из всех групп'
                    },

                    events: {
                        click: function() {
                            var key = "gvik";


                            if ( ( prompt( "Введите слово \"" + key + "\", чтобы подтвердить действие." ) || '' ).toLowerCase().trim() === key )
                                vkapi.call('execute.allGroupsLeave');
                        }
                    }
                } )
            } )
        ] );


    }, true );

    dom.setDelegate( document, '.group_list_row:not([data-gvik])', 'mouseover', function( el ) {

        el.setAttribute( 'data-gvik', 'true' );

        var child,
            infRow,
            but;

        if ( !( infRow = el.querySelector( '.group_row_info' ) ) ) {
            return;
        }

        dom.after( infRow, dom.create( 'span', {
            prop: {
                className: 'gvik-exit-group'
            },
            events: {
                click: function() {
                    vkapi.call( 'execute.groupLeave', {
                        gid: ( /\d+/.exec( el.id )[ 0 ] )
                    }, function() {
                        el.parentNode.removeChild( el );
                    } );
                }
            }
        } ) );

    } );


} );