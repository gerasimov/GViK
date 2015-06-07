/*




*/


GViK( function( gvik, require, Add ) {

	'use strict';

	var options = require( 'options' ),
		events = require( 'events' ),

		CNFS = options.get( 'im' );

	events.bind( 'IM', function( e ) {

		if ( !window.IM )
			return;

		if ( CNFS.get( 'mark-read' ) ) {
			IM.markRead = function( uid, msgIds ) {};
			IM.markPeer = function() {};
		}

		if ( CNFS.get( 'send-notify' ) )
			IM.onMyTyping = function( uid ) {};

	}, true );


} );