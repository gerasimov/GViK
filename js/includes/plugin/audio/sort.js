/*
 
 
 */

GViK( function( appData, require, add ) {

	var core = require( 'core' );
	var dom = require( 'dom' );
	var events = require( 'events' );
	var helpers = require( 'helpers' );
	var options = require( 'options' );
	var cache = require( 'cache' );
	var constants = require( 'constants' );

	var audios = [];

	function getCacheInt( id ) {
		return ( cache.get( helpers.CLEAN_ID( id ) ) || {} ).bitInt || -1;
	}

	events.bind( {
		'audio.process': function( data, e ) {
			audios = data.allAudios
		},
		'audio.bitrate.done': function( data, e ) {
			0 && dom.append( dom.byId( 'search_list' ), core.toArray( audios ).sort( function( a, b ) {
				return getCacheInt( a.id ) <= getCacheInt( b.id ) ? 1 : -1;
			} ) );
		}
	} );



} );