/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK( function( appData, require, add ) {

  'use strict';

  var arrproto = Array.prototype;
  var slice = arrproto.slice;
  var push = arrproto.push;

  function each( obj, fn, ctx ) {

    var keys = Object.keys( obj ).reverse();
    var l = keys.length;

    for ( ; l--; ) {
      fn.call( ctx, obj[ keys[ l ] ], keys[ l ], l === 0 );
    }
    return obj;
  }

  function extend( target ) {

    var arg = arguments;
    var i = 1;
    var l = arg.length;
    var keys;
    var z;
    var kl;

    for ( ; i < l; i++ ) {
      for ( z = 0, keys = Object.keys( arg[ i ] ), kl = keys.length; z < kl; z++ ) {
        target[ keys[ z ] ] = arg[ i ][ keys[ z ] ];
      }
    }

    return target;
  }

  function map( obj, fn ) {
    var ret = [];
    var keys = Object.keys( obj ).reverse();
    var l = keys.length;

    for ( ; l--; ) {
      ret.push( fn( obj[ keys[ l ] ], keys[ l ] ) );
    }
    return ret;
  }

  function filter( obj, fn ) {

    var ret = [];
    var keys = Object.keys( obj ).reverse();
    var l = keys.length;
    var curVal;

    for ( ; l--; ) {
      curVal = obj[ keys[ l ] ];
      if ( fn( curVal, keys[ l ] ) ) {
        ret.push( curVal );
      }
    }

    return ret;
  }

  function isFunction( fn ) {
    return typeof fn === 'function';
  }

  function isEmpty( obj ) {
    return !Object.keys( obj ).length;
  }

  function toObject( arrMap ) {
    var res = {};
    var l = arrMap.length;

    for ( ; l--; ) {
      res[ arrMap[ l ][ 0 ] ] = arrMap[ l ][ 1 ];
    }

    return res;
  }

  function toArray( arg ) {

    var l = arg.length;
    var res = [];

    if ( l < 2 ) {
      res = [ arg[ 0 ] ];
    } else {
      while ( l-- ) {
        res[ l ] = arg[ l ];
      }
    }
    return res;
  }

  function getResource( path, callback ) {
    return ajax( {
      type: 'GET',
      url: appData.IS_GVIK ?
        ( appData.APP_PATH + path ) : chrome.extension.getURL( path )
    }, callback, callback ? false : true );
  }

  function isPlainObject( obj ) {
    return obj != null && obj.constructor( 0 ) instanceof Number &&
      obj.constructor( '0' ) instanceof String;
  }

  function define( _scripts, data, callback ) {
    _scripts = Array.isArray( _scripts ) ? _scripts : [ _scripts ];

    if ( typeof data === 'function' || !data ) {
      callback = data;
      data = {};
    }

    var fileName;
    var script;
    var elem = document.head || document.documentElement;

    ( function require() {

      if ( script && script.parentNode ) {
        script.parentNode.removeChild( script );
      }

      if ( !( fileName = _scripts.shift() ) ) {
        return callback && callback();
      }

      script = document.createElement( 'script' );
      script.charset = 'utf-8';
      script.src = ( data.path || '' ) + fileName +
        ( ( data.suffix ) ? '?' + data.suffix : '' );

      if ( data.async !== false ) {
        script.async = true;

        script.addEventListener( 'load', require, false );
        script.addEventListener( 'error', require, false );

        elem.appendChild( script );
      } else {
        elem.appendChild( script );
        return require();
      }

    }() );
  }


  function initXHR( initfn ) {
    var xhr = new XMLHttpRequest();
    xhr.send( initfn( xhr ) );
  }

  function getHead( url, hName, succ, error ) {
    return initXHR( function( xhr ) {
      xhr.open( 'HEAD', url, true );
      xhr.addEventListener( 'load', function() {
        succ( hName ? this.getResponseHeader( hName ) : this.getAllResponseHeaders() );
      }, false );
      xhr.addEventListener( 'error', function() {
        error( this.getAllResponseHeaders() );
      }, false );
    } );
  }

  function ajax( data, callback, error, async ) {

    var type = data.type || 'GET';

    return initXHR( function( xhr ) {
      xhr.open( type, data.url, async ? false : true );

      xhr.addEventListener( 'load', function() {
        if ( xhr.status < 200 || xhr.status > 300 ) {
          error( xhr.status, xhr.statusText, this.getAllResponseHeaders() );
          return;
        }
        var ct = this.getResponseHeader( 'Content-Type' ) || '';
        var res = this.responseText;

        if ( ct.indexOf( 'application/json' ) !== -1 || data.dataType === 'json' ) {
          try {
            res = JSON.parse( res );
          } catch ( e ) {}
        }
        if ( callback ) {
          return callback( res );
        }
      }, false );

      xhr.addEventListener( 'error', error, false );

      if ( type === 'POST' ) {

        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

        if ( !isEmpty( data.data ) ) {
          return map( data.data, function( v, k ) {
              return encodeURIComponent( k ) + '=' + encodeURIComponent( v );
            } )
            .join( '&' );
        }
      }
    } );

  }

  function tmpl( str, obj ) {
    return template( str, /<\%\=[^>]*>/gi, [ 3, -1 ], obj );
  }

  function tmpl2( str, obj ) {
    return template( str, /\%\w/gi, [ 1 ], obj );
  }

  function tmpl3( str, obj ) {
    return template( str, /\%\w+\%/gi, [ 1, -1 ], obj );
  }

  function template( str, rexp, offset, obj ) {
    return str.replace( rexp, function( k ) {
      return obj[ k.slice( offset[ 0 ], offset[ 1 ] ) ] || '';
    } );
  }

  function bindFuncAfter( curFn, fn, ctx ) {
    return function() {
      var res = curFn.apply( this, arguments );
      res = fn.apply( ctx, [ arguments, res, curFn ] ) || res;
      return res;
    };
  }

  function bindFuncBefore( curFn, fn, ctx ) {
    return function() {
      var res = fn.apply( ctx, [ arguments, curFn ] ) || arguments;
      if ( !res.__disabled ) {
        return curFn.apply( ctx, res );
      }
    };
  }

  function decorator( fnPath, fn, bef, noallowrebind ) {

    var path = fnPath.split( '.' );
    var curParent = window;
    var curFn;
    var curProp;
    var curK = bef ? '_bef_ready' : '_aft_ready';
    var Fn = bef ? bindFuncBefore : bindFuncAfter;
    var i = 0;
    var l = path.length;

    for ( ; i < l; i++ ) {

      curProp = path[ i ];

      if ( !curParent[ curProp ] ) {
        return;
      }

      if ( typeof curParent[ curProp ] !== 'function' ) {
        curParent = curParent[ curProp ];
        continue;
      }

      if ( noallowrebind && curParent[ curProp ][ curK ] ) {
        return;
      }

      curParent[ curProp ] = Fn( curParent[ curProp ], fn, curParent );
      curParent[ curProp ][ curK ] = 1;
    }
  }

  add( 'core', {
    extend: extend,
    each: each,
    filter: filter,
    map: map,
    tmpl: tmpl,
    tmpl2: tmpl2,
    tmpl3: tmpl3,
    template: template,
    isPlainObject: isPlainObject,
    isEmpty: isEmpty,
    isFunction: isFunction,
    toObject: toObject,
    toArray: toArray,
    getResource: getResource,
    define: define,
    ajax: ajax,
    getHead: getHead,
    decorator: decorator,
    bindFuncBefore: bindFuncBefore,
    bindFuncAfter: bindFuncAfter

  } );

} );