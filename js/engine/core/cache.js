/**
 *
 *
 *
 *
 *
 *
 *
 */


_GViK( function( gvik, require, Add ) {

  var

    constants = require( 'constants' ),

    __cache = {},


    tId = setInterval( function() {

      __cache = null;
      __cache = {};


    }, constants.get( 'CACHE_CLEAR_TIMEOUT' ) );

  Add( 'cache', {
    get: function( key ) {
      return __cache[ key ];
    },
    set: function( key, val ) {
      __cache[ key ] = val;
    },
    del: function( key ) {
      __cache[ key ] = null;
      delete __cache[ key ];
    },
    has: function( key ) {
      return __cache[ key ] !== undefined;
    }
  } );

} );