/**
 *
 *
 *
 *
 *
 */

( function() {

  'use strict';

  if ( window.GViK ) {
    return;
  }

  function GRequire() {

    this.manifest = JSON.parse( sessionStorage.manifest );

    this.appInfo = {
      APP_PATH: sessionStorage.apppath,
      APP_ID: sessionStorage.appid,
      IS_GVIK: true,
      JS_LIST: JSON.parse( sessionStorage.jslist ),
      VERSION: this.manifest.version,
      VERSION_INT: this.manifest.version.replace( /\./g, '' ),
      AUTHOR: this.manifest.author,
      OS: navigator.platform.match( /^[a-z]+/i ).pop()
    }

    var __modules = {};

    this._export = {};

    this.makeName = function( name ) {
      return '__gvik__module__' + name.toLowerCase();
    };

    this.getModules = function() {
      return __modules;
    }.bind( this );

    this.hasModule = function( name ) {
      return __modules.hasOwnProperty( this.makeName( name ) );
    }.bind( this );

    this.addModule = function( name, data, noCallFnMod ) {


      if ( typeof name === 'string' ) {

        if ( this.hasModule( name ) ) {
          return;
        }

        __modules[ this.makeName( name ) ] = ( typeof data === 'function' && !noCallFnMod ) ?
          data() :
          data;
      } else {
        for ( var nameProp in name ) {
          this.addModule( nameProp, name[ nameProp ] );
        }
      }
    }.bind( this );

    this.getModule = function( name ) {
      return __modules[ this.makeName( name ) ];
    }.bind( this );

  };

  var gRequire = new GRequire();


  function GViK( fOpt, fMods, initfunc ) {

    if ( typeof fOpt === 'function' ) {
      initfunc = fOpt;
      fMods = [];
      fOpt = {};
    }

    if ( typeof fMods === 'function' ) {
      initfunc = fMods;
      if ( Array.isArray( fOpt ) ) {
        fMods = fOpt;
        fOpt = {};
      } else {
        fMods = [];
      }
    }

    if ( typeof initfunc !== 'function' || !fMods.every( gRequire.hasModule ) ) {
      return;
    }
    if ( gRequire.hasModule( 'options' ) !== undefined ) {

      var options = gRequire.getModule( 'options' );
      var i;

      for ( i in fOpt ) {
        if ( Array.isArray( fOpt[ i ] ) ) {
          if ( !fOpt[ i ].every( function( curOptName ) {
              return options.get( i, curOptName );
            } ) ) {
            return;
          }
        } else if ( !options.get( i, fOpt[ i ] ) ) {
          return;
        }
      }
    }

    initfunc.call( gRequire._export, gRequire.appInfo, gRequire.getModule, gRequire.addModule );

  }

  GViK.gRequire = gRequire;

  window.GViK = GViK;

} ).call( null, window );