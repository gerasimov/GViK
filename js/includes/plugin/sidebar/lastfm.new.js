/*
 
 
 
 */


GViK( {}, [ 'lastfmapi', 'sidebar' ], function( appData, require, add ) {

  var core = require( 'core' );
  var chrome = require( 'chrome' );
  var events = require( 'events' );
  var dom = require( 'dom' );
  var sidebar = require( 'sidebar' );
  var lastfmApi = require( 'lastfmApi' );

  var Plugin = require( 'Plugin' );

  var sidebarPage;

  function onNewTrack( audioId ) {
    sidebarPage.showLoading();


    var artist = dom.unes( audioPlayer.lastSong[ 5 ] );
    var title = dom.unes( audioPlayer.lastSong[ 6 ] );

    lastfmApi.call( 'artist.getInfo', {
      artist: artist
    }, events.callback( 'SIDEBAR_artistInfoLoaded' ) );

    lastfmApi.call( 'track.getInfo', {
      artist: artist,
      track: title
    }, events.callback( 'SIDEBAR_trackInfoLoaded' ) );
  }


  events.bind( 'SIDEBAR_trackInfoLoaded', function( trackInfo ) {
    sidebarPage.hideLoading();
  } );

  events.bind( 'SIDEBAR_artistInfoLoaded', function( artistInfo ) {
    sidebarPage.setHtml( core.tmpl( '<div><div><%=name></div></div>', artistInfo.artist ) )
      .hideLoading();
  } );

  ( new Plugin( {

    name: 'Sidebar Last.fm',
    version: '1.0.0',

    actions: {
      init: function() {

        if ( !sidebarPage ) {
          sidebarPage = sidebar.addPage();
        } else {

        }

        events.bind( 'audio.onNewTrack', onNewTrack );

        sidebarPage.hideLoading();
      },
      disable: function() {
        if ( sidebarPage ) {
          sidebarPage.remove();
        }
        sidebarPage = null;

        events.unbind( onNewTrack, 'audio.onNewTrack' );
      },
      enable: function() {
        this.init();
      }
    }
  } ) ).init();


} );