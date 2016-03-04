/**
 *
 *
 *
 */

<<<<<<< HEAD
GViK( function( gvik, require, add ) {

  'use strict';

  var core = require( 'core' );
  var constants = require( 'constants' );
  var storages = {};

  function Storage( storageName ) {

    if ( !/^local|session$/.test( storageName ) ) {
=======
GViK(function(gvik, require, add) {

  'use strict';

  var core = require('core');
  var constants = require('constants');
  var storages = {};

  var Storage = function(storageName) {

    if (!/^local|session$/.test(storageName)) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      storageName = 'local';
    }

    storageName += 'Storage';

    this._storage = function() {
      return window[ storageName ];
    };

<<<<<<< HEAD
    this._setPrefix = function( key ) {
      return [ 'gvik', key, constants.get( 'ID' ) || '' ].join( '-' );
=======
    this._setPrefix = function(key) {
      return ['gvik', key, constants.get('ID') || ''].join('-');
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    };

  };

<<<<<<< HEAD
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
        if ( core.isPlainObject( key ) ) {
          core.each( key, function( _v, _k ) {
            this.set( _k, _v );
          }.bind( this ) );
        }
        break;
      case 2:
        if ( core.isPlainObject( key ) ) {
          core.each( key, function( _v, _k ) {
            this.set( _k, _v, val );
          }.bind( this ) );
        } else {
          this._storage().setItem( this._setPrefix( key ), val );
        }
        break;
      case 3:
        if ( core.isFunction( fn ) ) {
          this.set( key, fn( val ) );
=======
  Storage.prototype.get = function(key, fn) {
    var res = this._storage().getItem(this._setPrefix(key));
    return core.isFunction(fn) ? fn(res) : res;
  };

  Storage.prototype.remove = function(key) {
    this._storage()
        .removeItem(this._setPrefix(key));
  };

  Storage.prototype.set = function(key, val, fn) {
    switch (arguments.length) {
      case 1:
        if (core.isPlainObject(key)) {
          core.each(key, function(_v, _k) {
                      this.set(_k, _v);
                    }.bind(this));
        }
        break;
      case 2:
        if (core.isPlainObject(key)) {
          core.each(key, function(_v, _k) {
            this.set(_k, _v, val);
          }.bind(this));
        } else {
          this._storage().setItem(this._setPrefix(key), val);
        }
        break;
      case 3:
        if (core.isFunction(fn)) {
          this.set(key, fn(val));
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }
        break;
      default:
        break;
    }

    return this;
  };

<<<<<<< HEAD
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

  add( 'storage', {
    session: new Storage( 'session' ),
    local: new Storage( 'local' )
  } );

} );
=======
  Storage.prototype.setJson = function(key, obj, fn) {
    return this.set(key, obj, function(jsonObject) {
      return JSON.stringify(jsonObject);
    });
  };

  Storage.prototype.getJson = function(key) {
    return this.get(key, function(json) {
      return JSON.parse(json || '0') || {};
    });
  };

  add('storage', {
    session: new Storage('session'),
    local: new Storage('local')
  });

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
