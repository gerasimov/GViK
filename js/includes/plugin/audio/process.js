GViK( function( appData, require, add ) {

	var core = require( 'core' );
	var dom = require( 'dom' );
	var events = require( 'events' );
	var helpers = require( 'helpers' );
	var options = require( 'options' );
	var cache = require( 'cache' );
	var constants = require( 'constants' );
	var chrome = require( 'chrome' );

	var ATTR_NAME = 'data-gvik-process';

	events.bind( [
		'audio.newRows',
		'audio',
		'padOpen'
	], function( data, evaname ) {


		var fromPad = data ? !!( data.el || data[ 0 ][ 0 ] ) : false;

		var audios = dom.byClass( 'audio' );
		var filteredAudios = core.filter( audios, function( audio ) {
			var hasAttr = audio.hasAttribute( ATTR_NAME );

			if ( !hasAttr ) {
				audio.setAttribute( ATTR_NAME, true );
			}
			return !hasAttr && audio.id !== 'audio_global';
		} );

		var l = filteredAudios.length;
		var i = 0;

		events.trigger( 'audio.process', {
			audios: filteredAudios,
			allAudios: audios,
			fromPad: fromPad
		} );

		for ( ; i < l; i++ ) {
			events.trigger( 'audio.process.every', {
				audio: filteredAudios[ i ],
				fromPad: fromPad
			} );
		}
	} );

	events.bind( 'gvik.loaded', events.callback( 'audio' ) );

} );