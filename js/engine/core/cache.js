/**
 *
 *
 *
 *
 *
 *
 *
 */

<<<<<<< HEAD
GViK( function( gvik, require, add ) {

  var __cache = new Map();

  var tId = setInterval( function() {
    __cache.clear();
  }, require( 'constants' ).get( 'CACHE_CLEAR_TIMEOUT' ) );

  add( 'cache', {
    get: function( key ) {
      return __cache.get( key );
    },
    set: function( key, val ) {
      __cache.set( key, val );
    },
    del: function( key ) {
      __cache.delete( key );
    },
    has: function( key ) {
      return __cache.has( key );
    }
  } );

} );
=======
GViK(function(gvik, require, Add) {

  var constants = require('constants');
  var __cache = new Map();
  var tId = setInterval(function() {
    __cache.clear();
  }, constants.get('CACHE_CLEAR_TIMEOUT'));

  Add('cache', {
    get: function(key) {
      return __cache.get(key);
    },
    set: function(key, val) {
      __cache.set(key, val);
    },
    del: function(key) {
      __cache.delete(key);
    },
    has: function(key) {
      return __cache.has(key);
    }
  });

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
