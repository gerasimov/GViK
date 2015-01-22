/*
 
 
 
 
 
 */


_GViK( function( gvik, require, Add ) {


    "use strict";

    var
        core = require( 'core' ),
        dom = require( 'dom' ),
        chrome = require( 'chrome' ),
        cache = require( 'cache' ),
        events = require( 'events' ),
        global = require( 'global' ),
        constants = require( 'constants' ),

        rId = /^audio\-?|\_pad$/gi;

    global.VARS.CLEAN_ID = function( id ) {
        return id.replace( rId, '' );
    };

    global.VARS.PARSE_AUDIO_DATA = function( el, id ) {

        var act = dom.byClass( 'actions', el )[ 0 ],
            input, url, dur, data, parsedData;


        if ( !id )
            id = global.VARS.CLEAN_ID( el.id );

        if ( ( data = cache.get( id ) ) ) {
            url = data.url;
            dur = data.dur;
        } else {
            input = dom.byTag( 'input', el )[ 0 ];
            parsedData = input.value.split( ',' );

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


    global.VARS.FORMAT_TIME = function( sec ) {
        var result = [],

            hours = ( '00' + ( ( sec / 3600 % 3600 ) | 0 ) )
            .slice( -2 ),
            mins = ( '00' + ( ( ( sec / 60 ) % 60 ) | 0 ) )
            .slice( -2 ),
            secs = ( '00' + ( sec % 60 ) )
            .slice( -2 );

        if ( hours !== '00' ) {
            result.push( hours );
        }
        result.push( mins );
        result.push( secs );

        return result.join( ':' );
    };



    global.VARS.GET_FILE_SIZE = function( url, callback ) {
        chrome.ajax( {
                type: 'HEAD',
                url: url,
                getheader: 'Content-Length'
            }, function( contentLenght ) {
                callback( contentLenght );
            },
            function() {
                callback( 0 );
            }, false );
    };


    global.VARS.LOG = function() {
        if ( constants.get( 'DEBUG' ) )
            console.log.apply( window.console, arguments );
    };

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


    global.VARS.DRAW_AUDIO = function( audio, callback ) {

        var _drawAudio = function( audio ) {
            return core.tmpl3( TMPL.audio, {
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

} );