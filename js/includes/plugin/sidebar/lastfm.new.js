/*



 */


GViK({}, ['lastfmapi', 'sidebar'] ,function(appData, require, add) {

  var core = require('core');
  var chrome = require('chrome');
  var events = require('events');
  var dom = require('dom');
  var sidebar = require('sidebar');
  var lastfmApi = require('lastfmApi');


  var sidebarPage = sidebar.addPage();


  dom.addClass(sidebarPage.tabCont, 'loaded');

  events.bind('audio.onNewTrack', function(audioId) {

    dom.removeClass(sidebarPage.tabCont, 'loaded');

    var artist = dom.unes(audioPlayer.lastSong[5]);
    var title = dom.unes(audioPlayer.lastSong[6]);

    lastfmApi.call('artist.getInfo', {
      artist: artist
    },  artistInfoLoaded);

    lastfmApi.call('track.getInfo', {
      artist: artist,
      track: title
    }, trackInfoLoaded);
  });


  function trackInfoLoaded(trackInfo) {
    dom.addClass(sidebarPage.tabCont, 'loaded');
  }

  function artistInfoLoaded(artistInfo) {
    sidebarPage.tabCont.innerHTML = core.tmpl('<div><div><%=name></div></div>',
                  artistInfo.artist);
    dom.addClass(sidebarPage.tabCont, 'loaded');
  }

 
});
