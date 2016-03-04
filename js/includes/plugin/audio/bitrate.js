/*
 
 
 
 
 */

GViK( {
    'audio': [
      'download-enable',
      'add-bit'
    ]
  },
  function( appData, require, Add ) {

    'use strict';

    var core = require( 'core' );
    var dom = require( 'dom' );
    var events = require( 'events' );
    var helpers = require( 'helpers' );
    var options = require( 'options' );
    var cache = require( 'cache' );

    var CONFS = options.get( 'audio' );

    var FILE_SIZE_ENABLED = CONFS.get( 'file-size' );
    var LOADER_DISABLED = CONFS.get( 'loader-disable' );

    var MIN_BIT = CONFS.get( 'min-bitrate' );
    var CLASS_BITRATE = [ 'gvik-bitrate', ( LOADER_DISABLED ? '' : ' loader' ) ].join( '' );
    var NAME_ATTR = [ 'data-gvik-bitrate', ( FILE_SIZE_ENABLED ? '-filesize' : '' ) ].join( '' );
    var AUDIO_SELECTOR = '.audio:not([id=audio_global]):not([' + NAME_ATTR + '])';

    var BIT_SELECTORS = core.map( [
      '',
      '.play_new',
      '.gvik-download'
    ], function( val ) {
      return ( AUDIO_SELECTOR + ' ' + val ).trim();
    } );

    if ( CONFS.get( 'bitrate-audio' ) ) {
      var BIT_SELECTOR = BIT_SELECTORS[ 0 ];
    } else if ( CONFS.get( 'bitrate-playBtn' ) ) {
      BIT_SELECTOR = BIT_SELECTORS[ 1 ];

    } else if ( CONFS.get( 'bitrate-downloadBtn' ) ) {
      BIT_SELECTOR = BIT_SELECTORS[ 2 ];
    }

    function __calcBitrate( size, dur ) {
      var bitInt = ( ( size * 8 ) / dur / 1000 ) | 0;
      var sizeInt = size / ( 1024 * 1024 ) | 0;
      var formated = bitInt + 'kbps';

      if ( FILE_SIZE_ENABLED ) {
        formated += ', ' + sizeInt + 'MB';
      }

      return {
        formated: formated,
        bitInt: bitInt,
        size: size,
        sizeInt: sizeInt
      };
    }

    function getCacheInt( id ) {
      return ( cache.get( helpers.CLEAN_ID( id ) ) || {} ).bitInt || -1;
    }

    function __getBitrate( url, dur, callback, id ) {

      if ( cache.has( id ) ) {
        callback( cache.get( id ), true );
        return 'gvik-bitrate';
      }

      helpers.GET_FILE_SIZE( url, function( size ) {
        if ( size ) {
          return callback( __calcBitrate( size, dur, id ) );
        }
      } );

      return CLASS_BITRATE;
    }

    var tId;


    function setBitrate( data, callback ) {

      data.audio.setAttribute( NAME_ATTR, true );

      var data = helpers.PARSE_AUDIO_DATA( data.audio );
      var bitrateEl = document.createElement( 'div' );

      data.act.appendChild( bitrateEl );

      bitrateEl.className = __getBitrate( data.url, data.dur, function( res, fromCache ) {

        if ( fromCache ) {
          //
        } else if ( !LOADER_DISABLED ) {
          bitrateEl.classList.remove( 'loader' );
        }

        bitrateEl.innerText = res.formated;

        res.url = data.url;
        res.dur = data.dur;
        res.id = data.id;

        if ( !fromCache ) {
          cache.set( data.id, res );
        }

        clearTimeout( tId );
        tId = setTimeout( function() {
          events.trigger( 'audio.bitrate.done', res );
        }, 20 );

      }, data.id );

    }

    if ( CONFS.get( 'auto-load-bit' ) ) {
      events.bind( 'audio.process.every', setBitrate );
    }


    dom.setDelegate( document, BIT_SELECTOR, 'mouseover', function( el, e ) {
      setBitrate( {
        audio: !dom.is( el, AUDIO_SELECTOR ) ? dom.parent( e, AUDIO_SELECTOR ) : el
      } );
    } );

  } );