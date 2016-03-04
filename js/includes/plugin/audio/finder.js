/*
 
 
 */


GViK( function( appData, require, add ) {

	var vkapi = require( 'vkapi' );
	var lastfmapi = require( 'lastfmapi' );
	var core = require( 'core' );


	function AudioFinder() {};

	AudioFinder.prototype.findAlbum = function( artistName, trackName, clb ) {

		lastfmapi.call( 'track.getInfo', {
			'track': trackName,
			'artist': artistName
		}, function( res ) {

			if ( clb ) {

			}
		} );

	};



	add( 'audioFinder', new AudioFinder );

} );