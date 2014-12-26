/**
 *
 *
 *
 */


_GViK( function( gvik, require, Add ) {

  "use strict";

  var core = require( 'core' ),


    storages = { },

    Storage = function( storageName ) {

      if ( !/^local|session$/.test( storageName ) ) {
        storageName = 'local';
      }

      storageName += 'Storage';

      this._storage = function() {
        return window[ storageName ];
      };

      this._setPrefix = function( key ) {
        return [ 'gvik', key, gvik.getID() || '' ].join( '-' );
      };

    };



  Storage.prototype.get = function( key, fn ) {
    var res = this._storage().getItem( this._setPrefix( key ) );
    return core.isFunction( fn ) ? fn( res ) : res;
  };

  Storage.prototype.remove = function( key ) {
    this._storage()
      .removeItem( this._setPrefix( key ) );
  };


  Storage.prototype.set = function( key, val, fn ) {
    switch ( arguments.length ) {
      case 1:
        if ( core.isPlainObject( key ) ) core.each( key, function( _v, _k ) {
          this.set( _k, _v );
        }.bind( this ) );
        break;
      case 2:
        if ( core.isPlainObject( key ) ) core.each( key, function( _v, _k ) {
          this.set( _k, _v, val );
        }.bind( this ) );
        else
          this._storage().setItem( this._setPrefix( key ), val );
        break;
      case 3:
        if ( core.isFunction( fn ) ) this.set( key, fn( val ) );
        break;
      default:
        break;
    }

    return this;
  };

  Storage.prototype.setJson = function( key, obj, fn ) {
    return this.set( key, obj, function( jsonObject ) {
      return JSON.stringify( jsonObject );
    } );
  };

  Storage.prototype.getJson = function( key ) {
    return this.get( key, function( json ) {
      return JSON.parse( json || '0' ) || {};
    } );
  };



  Add( 'storage', {
    session: new Storage( 'session' ),
    local: new Storage( 'local' )
  } );

} );