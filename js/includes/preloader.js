/**
 *
 *
 *
 *
 *
 */


( function() {

  "use strict";


  if ( window._GViK )
    return;

  var

    MANIFEST = JSON.parse( sessionStorage.manifest ),

    APP_DATA = {

      APP_PATH: sessionStorage.apppath,
      APP_ID: sessionStorage.appid,
      IS_GVIK: true,

      JS_LIST: JSON.parse( sessionStorage.jslist ),


      DEBUG: false,

      VERSION: MANIFEST.version,
      VERSION_INT: MANIFEST.version.replace( /\./g, '' ),
      AUTHOR: MANIFEST.author,


      OS: navigator.platform.match( /^[a-z]+/i )
        .pop()
    },

    _modules = {},

    require = function( moduleName ) {
      return _modules[ moduleName ];
    },

    add = function( moduleName, moduleVal ) {
      if ( !_modules[ moduleName ] )
        _modules[ moduleName ] = moduleVal;
    };


    var _export={};

  function Init( fOpt, fMods, initfunc ) {

    if ( typeof fOpt === 'function' ) {
      initfunc = fOpt;
      fMods = [];
      fOpt = {};
    }

    if ( typeof fMods === 'function' ) {
      initfunc = fMods;
      fMods = [];
    }

    if ( typeof initfunc === 'function' ) {

      if ( !fMods.every( function( curModuleName ) {
          return _modules.hasOwnProperty( curModuleName );
        } ) ) {
        return;
      }

      if ( require( 'options' ) !== undefined ) {

        var options = require( 'options' );

        for ( var i in fOpt ) {
          if ( Array.isArray( fOpt[ i ] ) ) {
            if ( !fOpt[ i ].every( function( curOptName ) {
                return options.get( i, curOptName );
              } ) )
              return;
          } else if ( !options.get( i, fOpt[ i ] ) )
            return;

        }
      }

      initfunc.call( APP_DATA, APP_DATA, require  );
    }
  }

  function Add( nameMod, fnMod, noCallFnMod ) {

    if ( typeof nameMod === 'string' ) {
      return add( nameMod, ( typeof fnMod === 'function' && !noCallFnMod ) ? fnMod() : fnMod );
    }

    if ( Array.isArray( nameMod ) ) {
      if ( Array.isArray( nameMod[ 0 ] ) ) {
        nameMod.forEach( function( curArr ) {
          curArr.push( true );
          Add.apply( this, curArr );
        } );
      } else {
        nameMod.push( true );
        Add.apply( this, nameMod );
      }
      return;
    }

    for ( var nameProp in nameMod ) {
      if ( nameMod.hasOwnProperty( nameProp ) ) {
        Add( nameProp, nameMod[ nameProp ] );
      }
    }
    return;
  }

  function Get() {
    return _modules;
  }


  window._GViK = {
    Init: Init,
    Add: Add,
    Get: Get
  };



}() );