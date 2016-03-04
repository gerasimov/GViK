/*
<<<<<<< HEAD
 
 */

GViK( {
  'audio': 'shortcut'
}, function( appData, require, Add ) {

  var events = require( 'events' );
  var chrome = require( 'chrome' );
  var initPlayer;

  events.bind( {
=======

 */

GViK({
  'audio': 'shortcut'
}, function(appData, require, Add) {

  var events = require('events');
  var chrome = require('chrome');
  var initPlayer;

  events.bind({
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    'audio.pause': function() {

    },

<<<<<<< HEAD
    'audio.start': function( tId ) {
      chrome.sendRequest( 'initShortcut', {
        data: {
          trackId: tId
        }
      } );
=======
    'audio.start': function(tId) {
      chrome.sendRequest('initShortcut', {
        data: {
          trackId: tId
        }
      });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    },

    'audio.globalStart': function() {
      initPlayer = true;
    },

<<<<<<< HEAD
    'globalKey': function( data ) {
      if ( initPlayer && ( data.res.trackId === audioPlayer.id ) ) {
        events.trigger( 'globalKey.' + data.command );
=======
    'globalKey': function(data) {
      if (initPlayer && (data.res.trackId === audioPlayer.id)) {
        events.trigger('globalKey.' + data.command);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      }
    },

    'globalKey.play-pause-track': function() {

<<<<<<< HEAD
      if ( audioPlayer.player.paused() ) {
=======
      if (audioPlayer.player.paused()) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
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
<<<<<<< HEAD
  } );
=======
  });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

});
