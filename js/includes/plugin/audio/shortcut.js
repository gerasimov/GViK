/*
 
 */


_GViK( {
	'audio': 'shortcut'
}, function( appData, require, Add ) {


	require( 'events' ).bind( {

		'globalKey.play-pause-track': function() {
			if ( audioPlayer.player.paused() )
				audioPlayer.playTrack();
			else
				audioPlayer.pauseTrack();
		},

		'globalKey.pause-track': function() {
			audioPlayer.pauseTrack();
		},

		'globalKey.play-track': function() {
			audioPlayer.playTrack();
		},


		'globalKey.next-track': function() {
			audioPlayer.nextTrack();
		},

		'globalKey.prev-track': function() {
			audioPlayer.prevTrack();
		}
	} );



} );