/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK( function( gvik, require, Add ) {

  'use strict';

  var options = require( 'options' ),
    dom = require( 'dom' ),
    chrome = require( 'chrome' ),
    vkapi = require( 'vkapi' ),
    event = require( 'event' ),
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