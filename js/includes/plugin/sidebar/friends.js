/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK( {
        'sidebar': 'friendsfaves-module'
    }, [
        'sidebar'
    ],
    function( gvik, require, Add ) {

        "use strict";

        var

            core = require( 'core' ),
            dom = require( 'dom' ),
            events = require( 'events' ),
            vkapi = require( 'vkapi' ),
            sidebar = require( 'sidebar' ),
            options = require( 'options' ),
            chrome = require( 'chrome' ),

            cnfg = options.get( 'sidebar' ),

            stateLoad = false,
            _faveElements = [],
            _uids = [],
            _avatars = [],
            tab,
            tabCont,
            wrap,
            switcher,
            tabCont,
            TMPL = {
                item: '<div class="gvikLink item" data-online="<%=online>" data-href="<%=href>" data-uid="<%=uid>">\
                <div class="item-cont">\
                    <div class="img-cont">\
                        <div class="img" style="background-image: url(<%=photo>);"></div>\
                    </div>\
                    <div class="label-cont">\
                        <span class="label"><%=name></span>\
                    </div>\
                    <span class="status"></span>\
                </div>\
                </div>'
            },
            API_METHOD = 'fave.getUsers';

        if ( cnfg.get( 'friends' ) ) API_METHOD = 'friends.get';



        vkapi.pushPermission( 'friends' );


        function vkcall( method, data, success, error ) {
            tabCont.classList.remove( 'loaded' );
            vkapi.call( method, data, function() {
                success.apply( this, arguments );
                tabCont.classList.add( 'loaded' );
            }, function() {
                error && error.apply( this, arguments );
                tabCont.classList.add( 'loaded' );
            } );
        }

        function load() {
            stateLoad = false;

            vkcall( API_METHOD, {
                fields: 'online,photo_50,domain',
                count: 200,
                order: 'hints',
                v: '5.21'
            }, function( res ) {
                stateLoad = true;
                tabCont.innerHTML = res.items.map( function( user, i ) {
                    return core.tmpl( TMPL.item, {
                        online: ( user.online ? ( user.online_mobile ? 2 : 1 ) : 0 ),
                        href: user.domain,
                        uid: ( _uids[ i ] = user.id ),
                        photo: user.image_src || user.photo_50,
                        name: user.title || user.first_name + ' ' + user.last_name
                    } )
                } ).join( '' );
                _faveElements = tabCont.children;
            } );
        }


        function update() {
            stateLoad && vkcall( 'execute.getOnline', {
                uids: _uids.toString()
            }, function( res ) {
                var val = core.toObject( core.map( res.trim()
                    .split( /\s/ ),
                    function( v ) {
                        return v.split( ':' );
                    } ) );

                core.each( _uids, function( v, i ) {
                    dom.setData( _faveElements[ i ], 'online', ( val[ i ] !== undefined ?
                        ( val[ i ] ? 2 : 1 ) :
                        0 ) );
                } )
            } );
        }


        sidebar.addPage( function( _switcher, _tabCont, _wrap ) {

            switcher = _switcher;
            tabCont = _tabCont;
            wrap = _wrap;

            tabCont.classList.add( 'vk' );

            // switcher.classList.add('icon-users');

            if ( cnfg.get( 'hide-offline' ) ) {
                tabCont.classList.add( 'hidden-offline' );
            }


        } );


        events.bind( 'SIDEBAR_show', function() {
                stateLoad ?
                    update() :
                    load()
            } )
            .bind( 'SIDEBAR_hide', function() {

            } );

    } );