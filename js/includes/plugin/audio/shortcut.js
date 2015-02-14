/*
 
 */


_GViK( {
	'audio': 'shortcut'
}, function( appData, require, Add ) {


	var events = require( 'events' ),
		chrome = require('chrome');

 

	var initPlayer ;



	events

		.bind('audio.pause', function(){

		})

		.bind('audio.start', function( tId ){
			 
 			chrome.sendRequest('initShortcut', {
 				data:{
 					trackId: tId
 				}
 			})
		})

		.bind('audio.globalStart', function(){
			initPlayer = true;
		})


		.bind( 'globalKey', function( data ) {

			if( initPlayer && (data.res.trackId === audioPlayer.id ) )
				events.trigger( 'globalKey.' + data.command ) 
	} )

	.bind( {

		'globalKey.play-pause-track': function(  ) {

			if ( audioPlayer.player.paused() )
				audioPlayer.playTrack();
			else
				audioPlayer.pauseTrack();
		}, 

		'globalKey.next-track': function() {
			audioPlayer.nextTrack();
		},

		'globalKey.prev-track': function() {
			audioPlayer.prevTrack();
		}
	} );



} );