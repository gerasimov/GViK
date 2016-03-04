/*
 
 */

GViK( {
  'audio': 'shortcut'
}, function( appData, require, Add ) {

  var events = require( 'events' );
  var chrome = require( 'chrome' );
  var initPlayer;

  events.bind( {

    'audio.pause': function() {

    },

    'audio.start': function( tId ) {
      chrome.sendRequest( 'initShortcut', {
        data: {
          trackId: tId
        }
      } );
    },

    'audio.globalStart': function() {
      initPlayer = true;
    },

    'globalKey': function( data ) {
      if ( initPlayer && ( data.res.trackId === audioPlayer.id ) ) {
        events.trigger( 'globalKey.' + data.command );
      }
    },

    'globalKey.play-pause-track': function() {

      if ( audioPlayer.player.paused() ) {
        audioPlayer.playTrack();
      } else {
        audioPlayer.pauseTrack();
      }
    },

    'globalKey.next-track': function() {
      audioPlayer.nextTrack();
    },

    'globalKey.prev-track': function() {
      audioPlayer.prevTrack();
    }
  } );

} );