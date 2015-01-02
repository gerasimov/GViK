/**
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {


  "use strict";


  var

    core = require( 'core' ),
    dom = require( 'dom' ),
    global = require( 'global' ),
    search = require( 'search' ),

    TMPL = {
      audio: '<div class="audio fl_l" id="audio%audio_id%" onmouseover="addClass(this, \'over \');" onmouseout="removeClass(this, \'over\');">\
                  <a name="%audio_id%"></a>\
                  <div class="area clear_fix" onclick="if (cur.cancelClick){ cur.cancelClick = false; return;} %onclick%">\
                    <div class="play_btn fl_l">\
                      <div class="play_btn_wrap"><div class="play_new" id="play%audio_id%"></div></div>\
                      <input type="hidden" id="audio_info%audio_id%" value="%url%,%playtime%" />\
                    </div>\
                    <div class="info fl_l">\
                      <div class="title_wrap fl_l" onmouseover="setTitle(this);"><b><a %attr%>%performer%</a></b> &ndash; <span class="title">%title% </span><span class="user" onclick="cur.cancelClick = true;">%author%</span></div>\
                      <div class="actions">\
                        %actions%\
                      </div>\
                      <div class="duration fl_r">%duration%</div>\
                    </div>\
                  </div>\
                  <div id="lyrics%audio_id%" class="lyrics" nosorthandle="1"></div>\
                </div>'
    };


  function drawAudio( audio, callback ) {

    var _drawAudio = function( audio ) {
      return rs( TMPL.audio, {
        audio_id: audio[ 0 ] + '_' + audio[ 1 ],
        performer: audio[ 5 ],
        title: audio[ 6 ],
        url: audio[ 2 ],
        playtime: audio[ 3 ],
        duration: audio[ 4 ]
      } );
    };


    return _drawAudio( [
                audio.owner_id,
                audio.id,
                audio.url,
                audio.duration,
                global.VARS.FORMAT_TIME( audio.duration ),
                audio.artist,
                audio.title,
                0,
                0,
                1
            ] );
  }

  var trackContainer = dom.create( 'div', {
    style: {
      display: 'none'
    }
  } );

  dom.append( document.body, trackContainer );

  Add( 'searchandplay', function( searchData, callback, opt ) {

    search.audioSearch( searchData, function( result ) {

      if ( !result ) {
        return;
      }

      var audioData = ( result.length != null ) ?
        result[ 0 ] :
        result;

      if ( !audioData )
        return;

      var audio = audioData.audio || audioData,
        audioHTML = drawAudio( audio );

      trackContainer.innerHTML += audioHTML;

      callback( result );

      window.playAudioNew( audio.owner_id + '_' + audio.id );

    }, opt );
  }, true );



} );