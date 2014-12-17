/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */





_GViK.Init( function( gvik, require ) {

'use strict';

    var configs = require( 'configs' ),
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
                        click: function() { }
                    }
                } )
            } )
        ] );


    }, true );


    if ( configs.get( 'groups', 'fast-exit' ) ) {

        dom.setDelegate( document, '.group_list_row:not([data-gvik])', 'mouseover', function( el ) {

            el.setAttribute( 'data-gvik', 'true' );

            var child,
                infRow,
                but;

            if ( !( infRow = el.querySelector( '.group_row_info' ) ) ) {
                return;
            }

            but = dom.create( 'span', {
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
            } );

            dom.after( infRow, but );

        } );

    }

    if ( configs.get( 'audio', 'faster' ) ) {
        event.bind( 'audio', function() {
            if ( window.sorter && window.sorter.added ) {
                window.sorter.added = function() {};
            }
        }, true );
    }

    event.bind( 'IM', function( e ) {
        var cfs = configs.get( 'im' );
        if ( cfs.get( 'mark-read' ) ) {
            IM.markRead = function( uid, msgIds ) {};
            IM.markPeer = function() {};
        }
        if ( cfs.get( 'send-notify' ) ) {
            IM.onMyTyping = function( uid ) {};
        }
    }, true );

    if ( configs.get( 'common', 'state-onlineChange' ) ) {

        if ( configs.get( 'common', 'set-offline' ) ) {

            event.bind( 'changePage', function() {
                vkapi.call( 'account.setOffline' );
            }, true );

        } else if ( configs.get( 'common', 'set-online' ) ) {
            var _cerr = 0,
                fn = function() {
                    vkapi.call( 'account.setOnline', {}, function() {
                        setTimeout( fn, ( 14 * 60 ) * 1000 );
                        _cerr = 0;
                    }, function() {
                        if ( _cerr < 4 ) fn();
                        _cerr++;
                    } );
                };

            fn();
        }
    }








} );