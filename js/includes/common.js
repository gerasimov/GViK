/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK.Init( function( gvik, require ) {

  'use strict';

  var options = require( 'options' ),
    dom = require( 'dom' ),
    chrome = require( 'chrome' ),
    vkapi = require( 'vkapi' ),
    event = require( 'event' ),
    core = require( 'core' );



  event.bind( 'IM', function( e ) {
    var cfs = options.get( 'im' );
    if ( cfs.get( 'mark-read' ) ) {
      IM.markRead = function( uid, msgIds ) {};
      IM.markPeer = function() {};
    }
    if ( cfs.get( 'send-notify' ) ) {
      IM.onMyTyping = function( uid ) {};
    }
  }, true );

  if ( options.get( 'common', 'state-onlineChange' ) ) {

    if ( options.get( 'common', 'set-offline' ) ) {
      event.bind( 'changePage', function() {
        vkapi.call( 'account.setOffline' );
      }, true );

    }


    if ( options.get( 'common', 'set-online' ) ) {
      ( function _setOnline() {
        setTimeout( function() {
          vkapi.call( 'account.setOnline', {}, _setOnline, _setOnline );
        }, ( 14 * 60 ) * 1000 );
      }() );
    }
  }



} );