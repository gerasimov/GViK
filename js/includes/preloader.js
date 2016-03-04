/**
 *
 *
 *
 *
 *
 */

<<<<<<< HEAD
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
=======
(function() {

  'use strict';

  if (window.GViK) {
    return;
  }

  var  MANIFEST = JSON.parse(sessionStorage.manifest);
  var APP_DATA = {
    APP_PATH: sessionStorage.apppath,
    APP_ID: sessionStorage.appid,
    IS_GVIK: true,
    JS_LIST: JSON.parse(sessionStorage.jslist),
    VERSION: MANIFEST.version,
    VERSION_INT: MANIFEST.version.replace(/\./g, ''),
    AUTHOR: MANIFEST.author,
    OS: navigator.platform.match(/^[a-z]+/i).pop()
  };

  var _modules = {};
  var require = function(moduleName) {
    moduleName = moduleName.toLowerCase();
    return _modules[ moduleName ];
  };
  var add = function(moduleName, moduleVal) {
    moduleName = moduleName.toLowerCase();
    if (!_modules[ moduleName ]) {
      _modules[ moduleName ] = moduleVal;
    }
  };
  var _export = {};

  function Add(nameMod, fnMod, noCallFnMod) {

    if (typeof nameMod === 'string') {
      return add(nameMod, (typeof fnMod === 'function' && !noCallFnMod) ?
            fnMod() :
            fnMod);
    }

    for (var nameProp in nameMod) {
      Add(nameProp, nameMod[ nameProp ]);
    }
  }

  function GViK(fOpt, fMods, initfunc) {

    if (typeof fOpt === 'function') {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      initfunc = fOpt;
      fMods = [];
      fOpt = {};
    }

<<<<<<< HEAD
    if ( typeof fMods === 'function' ) {
      initfunc = fMods;
      if ( Array.isArray( fOpt ) ) {
=======
    if (typeof fMods === 'function') {
      initfunc = fMods;
      if (Array.isArray(fOpt)) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        fMods = fOpt;
        fOpt = {};
      } else {
        fMods = [];
      }
    }

<<<<<<< HEAD
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
=======
    if (typeof initfunc === 'function') {

      if (!fMods.every(function(curModuleName) {
        return _modules.hasOwnProperty(curModuleName);
      })) {
        return;
      }

      if (require('options') !== undefined) {

        var options = require('options');
        var i;

        for (i in fOpt) {
          if (Array.isArray(fOpt[ i ])) {
            if (!fOpt[ i ].every(function(curOptName) {
              return options.get(i, curOptName);
            })) {
              return;
            }
          } else if (!options.get(i, fOpt[ i ])) {
            return;
          }
        }
      }

      initfunc.call(_export, APP_DATA, require, Add);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    }
  }

<<<<<<< HEAD
    initfunc.call( gRequire._export, gRequire.appInfo, gRequire.getModule, gRequire.addModule );

  }

  GViK.gRequire = gRequire;

  window.GViK = GViK;

} ).call( null, window );
=======
  window.GViK = GViK;

}).call(null, window);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
