/*





 */


_GViK( function( gvik, require, Add ) {


  "use strict";

  var
    core = require( 'core' ),
    dom = require( 'dom' ),
    cache = require( 'cache' ),
    event = require( 'event' ),
    global = require( 'global' ),
    constants = require( 'constants' );

  global.VARS.PARSE_AUDIO_DATA = function( el, id ) {

    var act = dom.query( '.actions', el ),
      input, url, dur, data, parsedData;


    if ( !id )
      id = el.id;

    if ( ( data = cache.get( id ) ) ) {
      url = data.url;
      dur = data.dur;
    } else {
      input = dom.query( 'input', el );
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

} );