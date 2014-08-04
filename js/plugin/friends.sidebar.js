/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



"use strict";
gvik.Check( {
    'sidebar': 'friendsfaves-module'
}, [ 'sidebar' ], function( gvik ) {

    var stateLoad = false,
        _faveElements = [],
        _uids = [],
        _avatars = [],
        cnfg = gvik.GetConfig( 'sidebar' ),
        tab,
        tabCont,
        wrap,
        switcher,
        tabCont,
        html = '',
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

    if ( cnfg.get( 'friends' ) ) API_METHOD = 'friends.get';;


    function vkcall( method, data, success, error ) {
        tabCont.classList.remove( 'loaded' );
        gvik.vkapi.call( method, data, function() {
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
            gvik.core.each( res.items, function( user, i ) {
                html += gvik.util.tmpl( TMPL.item, {
                    online: ( user.online ? ( user.online_mobile ? 2 : 1 ) : 0 ),
                    href: user.domain,
                    uid: ( _uids[ i ] = user.id ),
                    photo: user.image_src || user.photo_50,
                    name: user.title || user.first_name + ' ' + user.last_name
                } );
            }, true );

            tabCont.innerHTML = html;
            _faveElements = tabCont.children;
        } );
    }


    function update() {
        stateLoad && vkcall( 'execute.getOnline', {
            uids: _uids.toString()
        }, function( res ) {
            var val = gvik.core.toObject( gvik.core.map( res.trim()
                .split( /\s/ ), function( v ) {
                    return v.split( ':' );
                } ) );

            gvik.core.each( _uids, function( v, i ) {
                gvik.dom.setData( _faveElements[ i ], 'online', ( val[ i ] !== undefined ?
                    ( val[ i ] ? 2 : 1 ) :
                    0 ) );
            } )
        } );
    }


    gvik.sidebar.addPage( function( _switcher, _tabCont, _wrap ) {

        switcher = _switcher;
        tabCont = _tabCont;
        wrap = _wrap;

        tabCont.classList.add( 'vk' );

        // switcher.classList.add('icon-users');

        if ( cnfg.get( 'hide-offline' ) ) {
            tabCont.classList.add( 'hidden-offline' );
        }

        gvik.dom.setDelegate( tabCont, '.gvikLink', 'click', function() {

            var hrf = this.getAttribute( 'data-href' );

            if ( cnfg.get( 'open-ajax' ) ) {
                return window.nav && window.nav.go( hrf )
            }

            if ( cnfg.get( 'open-newTab' ) ) {
                return gvik.chrome.openTab( hrf, {}, {
                    orUpd: true
                } )
            }

            if ( cnfg.get( 'open-cur' ) ) {
                location.href = hrf;
            }
        } );
    } );


    gvik.event
        .SIDEBAR_show( function() {
            stateLoad ?
                update() :
                load()
        } )
        .SIDEBAR_hide( function() {

        } );

} );