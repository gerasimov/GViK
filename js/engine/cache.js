/**
 *
 *
 *
 *
 *
 *
 *
 */


_GViK.Init( function( gvik ) {

  var __cache = {};

  _GViK.Add( 'cache', {
    get: function( key ) {
      return __cache[ key ];
    },
    set: function( key, val ) {
      __cache[ key ] = val;
    },
    has: function( key ) {
      return __cache[ key ] !== undefined;
    }
  } );

} );