/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



GViK( {
    'sidebar': 'friendsfaves-module'
  }, [
    'sidebar'
  ],
  function( gvik, require, Add ) {

    "use strict";

    var core = require( 'core' );
    var dom = require( 'dom' );
    var events = require( 'events' );
    var vkapi = require( 'vkapi' );
    var sidebar = require( 'sidebar' );
    var options = require( 'options' );
    var chrome = require( 'chrome' );
    var cnfg = options.get( 'sidebar' );


    var stateLoad = false;
    var _faveElements = [];
    var _uids = [];
    var _avatars = [];
    var sidebarPage;


    var TMPL = {
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
    };
    var API_METHOD = 'fave.getUsers';

    if ( cnfg.get( 'friends' ) ) {
      API_METHOD = 'friends.get';
    }

    vkapi.pushPermission( 'friends' );


    function vkcall( method, data, success, error, showLoading ) {
      if ( showLoading !== false ) {
        sidebarPage.showLoading();
      }
      vkapi.call( method, data, function() {
        success.apply( this, arguments );
        if ( showLoading !== false ) {
          sidebarPage.hideLoading();
        }
      }, function() {
        error && error.apply( this, arguments );
        if ( showLoading !== false ) {
          sidebarPage.hideLoading();
        }
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
        sidebarPage.setHtml( res.items.map( function( user, i ) {
          return core.tmpl( TMPL.item, {
            online: ( user.online ? ( user.online_mobile ? 2 : 1 ) : 0 ),
            href: user.domain,
            uid: ( _uids[ i ] = user.id ),
            photo: user.image_src || user.photo_50,
            name: user.title || user.first_name + ' ' + user.last_name
          } )
        } ).join( '' ) );
        _faveElements = sidebarPage.page.children;
      } );
    }


    function update( showLoading ) {
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
      }, 0, showLoading );
    }

    sidebarPage = sidebar.addPage();

    sidebarPage.page.classList.add( 'vk' );
    if ( cnfg.get( 'hide-offline' ) ) {
      sidebarPage.page.classList.add( 'hidden-offline' );
    }

    var upInt = setInterval( function() {
      update( false );
    }, 5000 );


    events.bind( 'SIDEBAR_show', function() {

        stateLoad ?
          update( false ) :
          load()
      } )
      .bind( 'SIDEBAR_hide', function() {

      } );

  } );