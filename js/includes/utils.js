/*
<<<<<<< HEAD
 
 
 
 
 
 */

GViK( function( gvik, require, Add ) {

  'use strict';

  var core = require( 'core' );
  var dom = require( 'dom' );
  var chrome = require( 'chrome' );
  var cache = require( 'cache' );
  var events = require( 'events' );
  var helpers = require( 'helpers' );
  var constants = require( 'constants' );

  var rId = /^audio|\_pad$/gi;

  helpers.CLEAN_ID = function( id ) {
    return id.replace( rId, '' );
  };

  helpers.PARSE_AUDIO_DATA = function( el, id ) {

    var act = dom.byClass( 'actions', el )[ 0 ];
=======





 */

GViK(function(gvik, require, Add) {

  'use strict';

  var core = require('core');
  var dom = require('dom');
  var chrome = require('chrome');
  var cache = require('cache');
  var events = require('events');
  var global = require('global');
  var constants = require('constants');

  var rId = /^audio|\_pad$/gi;

  global.VARS.CLEAN_ID = function(id) {
    return id.replace(rId, '');
  };

  global.VARS.PARSE_AUDIO_DATA = function(el, id) {

    var act = dom.byClass('actions', el)[ 0 ];
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    var input;
    var url;
    var dur;
    var data;
    var parsedData;

<<<<<<< HEAD
    if ( !id ) {
      id = helpers.CLEAN_ID( el.id );
    }

    if ( ( data = cache.get( id ) ) ) {
      url = data.url;
      dur = data.dur;
    } else {
      input = dom.byTag( 'input', el )[ 0 ];
      parsedData = input.value.split( ',' );
=======
    if (!id) {
      id = global.VARS.CLEAN_ID(el.id);
    }

    if ((data = cache.get(id))) {
      url = data.url;
      dur = data.dur;
    } else {
      input = dom.byTag('input', el)[ 0 ];
      parsedData = input.value.split(',');
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

      url = parsedData[ 0 ];
      dur = parsedData[ 1 ];
    }

    return {
      id: id,
      act: act,
      url: url,
      dur: dur
    };
  };

<<<<<<< HEAD
  helpers.PARSE_AUDIO = function( el ) {

    var id = helpers.CLEAN_ID( el.id );

    if ( dom.is( el, '#audio_global' ) ) {
      id = window.audioPlayer.id;
    }

    if ( window.audioPlaylist && window.audioPlaylist[ id ] ) {
      return window.audioPlaylist[ id ];
    }

    var infoEl = dom.byClass( 'info', el ).item( 0 );
    var artistEl = dom.byTag( 'b', infoEl ).item( 0 );
    var titleEl = artistEl.nextElementSibling;
    var input = dom.byTag( 'input', el ).item( 0 );
    var parsedData = input.value.split( ',' );

    var splitedId = id.split( '_' );

    return [
      splitedId[ 0 ],
      splitedId[ 1 ],
      parsedData[ 0 ],
      parsedData[ 1 ],
      helpers.FORMAT_TIME( parsedData[ 1 ] ),
      artistEl.innerText,
      titleEl.innerText,
      0,
      0,
      1
    ];
  };

  helpers.FORMAT_TIME = function( sec ) {
    var result = [];
    var hours = ( '00' + ( ( sec / 3600 % 3600 ) | 0 ) )
      .slice( -2 );
    var mins = ( '00' + ( ( ( sec / 60 ) % 60 ) | 0 ) )
      .slice( -2 );
    var secs = ( '00' + ( sec % 60 ) )
      .slice( -2 );

    if ( hours !== '00' ) {
      result.push( hours );
    }
    result.push( mins );
    result.push( secs );

    return result.join( ':' );
  };

  helpers.GET_FILE_SIZE = function( url, callback ) {
    chrome.getHead( url, 'content-length', function( contentLenght ) {
        callback( contentLenght );
      },
      function() {
        callback( 0 );
      } );

  };

  helpers.LOG = function() {
    if ( constants.get( 'DEBUG' ) ) {
      console.log.apply( window.console, arguments );
    }
  };

=======
  global.VARS.PARSE_AUDIO = function(el) {

    var id = global.VARS.CLEAN_ID(el.id);

    if (dom.is(el, '#audio_global')) {
      id = window.audioPlayer.id;
    }

    if (window.audioPlaylist && window.audioPlaylist[ id ]) {
      return window.audioPlaylist[ id ];
    }

    var infoEl = dom.byClass('info', el).item(0);
    var artistEl = dom.byTag('b', infoEl).item(0);
    var titleEl = artistEl.nextElementSibling;
    var input = dom.byTag('input', el).item(0);
    var parsedData = input.value.split(',');

    var splitedId = id.split('_');

    return [
        splitedId[ 0 ],
        splitedId[ 1 ],
        parsedData[ 0 ],
        parsedData[ 1 ],
        global.VARS.FORMAT_TIME(parsedData[ 1 ]),
        artistEl.innerText,
        titleEl.innerText,
        0,
        0,
        1
    ];
  };

  global.VARS.FORMAT_TIME = function(sec) {
    var result = [];
    var hours = ('00' + ((sec / 3600 % 3600) | 0))
        .slice(-2);
    var mins = ('00' + (((sec / 60) % 60) | 0))
        .slice(-2);
    var secs = ('00' + (sec % 60))
        .slice(-2);

    if (hours !== '00') {
      result.push(hours);
    }
    result.push(mins);
    result.push(secs);

    return result.join(':');
  };

  global.VARS.GET_FILE_SIZE = function(url, callback) {
    chrome.getHead( url, 'content-length' , function(contentLenght) {
      callback(contentLenght);
    },
    function() {
      callback(0);
    });

  };

  global.VARS.LOG = function() {
    if (constants.get('DEBUG')) {
      console.log.apply(window.console, arguments);
    }
  };

>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
  var TMPL = {
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

<<<<<<< HEAD
  helpers._DRAW_AUDIO = function( audio ) {

    return core.tmpl3( TMPL.audio, {
=======
  global.VARS._DRAW_AUDIO = function(audio) {

    return core.tmpl3(TMPL.audio, {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      audio_id: audio[ 0 ] + '_' + audio[ 1 ],
      performer: audio[ 5 ],
      title: audio[ 6 ],
      url: audio[ 2 ],
      playtime: audio[ 3 ],
      duration: audio[ 4 ]
<<<<<<< HEAD
    } );
  }

  helpers.DRAW_AUDIO = function( audio, callback ) {

    return helpers._DRAW_AUDIO( [
      audio.owner_id,
      audio.id,
      audio.url,
      audio.duration,
      helpers.FORMAT_TIME( audio.duration ),
      audio.artist,
      audio.title,
      0,
      0,
      1
    ] );
  };

} );
=======
    });
  }

  global.VARS.DRAW_AUDIO = function(audio, callback) {

    return global.VARS._DRAW_AUDIO([
        audio.owner_id,
        audio.id,
        audio.url,
        audio.duration,
        global.VARS.FORMAT_TIME(audio.duration),
        audio.artist,
        audio.title,
        0,
        0,
        1
    ]);
  };

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
