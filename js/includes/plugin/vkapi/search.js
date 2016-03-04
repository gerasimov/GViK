/**
 *
 *
 *
 *
 */

GViK( {}, [
    'vkapi'
  ],
  function( gvik, require, Add ) {

    "use strict";


    var
      core = require( 'core' ),
      vkapi = require( 'vkapi' ),
      helpers = require( 'helpers' ),
      chrome = require( 'chrome' );



    vkapi.pushPermission( 'audio' );


    var _eq = function( a, b ) {
        return a.replace( /\s+/g, '' )
          .toLowerCase() === b.replace( /\s+/g, '' )
          .toLowerCase();
      },

      _eq2 = function( a, b ) {
        a = a.replace( /\s+/g, '' ).toLowerCase();
        b = b.replace( /\s+/g, '' ).toLowerCase();


        return a.indexOf( b ) !== -1 || b.indexOf( a ) !== -1;
      };

    function getBitrate( data, callback, error ) {
      helpers.GET_FILE_SIZE( data.audio.url, function( len ) {
        data.bit = calcBit( data.audio.duration, len );
        callback( data );
      } );
    }

    function calcBit( dur, len ) {
      return ( ( len * 8 ) / ( dur || 1 ) / 1000 ) | 0
    }

    function getBiggestBitrate( audioMap, callback ) {

      var res = [],
        ready = false,
        data;

      ( function fn() {

        if ( !( data = audioMap.shift() ) ) {
          return callback( res.sort( function( a, b ) {
            return b.bit - a.bit;
          } ) );
        }

        getBitrate( data, function( _data ) {
          if ( _data.bit > 300 )
            return callback( _data );

          res.push( _data );
          setTimeout( fn );
        } );
      }() );

    }


    function searchInArray( arr, data, fn ) {
      var res = [];

      core.each( arr, function( audio ) {
        if ( fn( audio.artist, data.artist ) && fn( audio.title, data.title ) ) {
          res.push( {
            audio: audio,
            dur: Math.abs( audio.duration - data.dur )
          } );
        }
      }, true );

      return res;
    }

    function find( data, arr, callback, opt ) {

      var audioMap;

      if ( !data.q && ( data.artist && data.title ) ) {
        if ( !( audioMap = searchInArray( arr, data, _eq ) ).length &&
          !( audioMap = searchInArray( arr, data, _eq2 ) ).length ) {
          return callback( arr );
        }
      } else {
        audioMap = arr;
      }

      opt.maxbit ?
        getBiggestBitrate( audioMap, callback ) :
        callback( audioMap );
    }


    vkapi._extend( 'audioSearch', function( data, callback, opt ) {
      vkapi.call( 'audio.search', {
        q: data.q || [ data.artist, data.title ].join( ' - ' ),
        count: data.count || 50,
        sort: 2
      }, function( res ) {
        find( data, res.items, callback, opt );
      } )
    } );


  } );