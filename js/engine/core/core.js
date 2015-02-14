/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( appData, require, Add ) {

    "use strict";

    var arrproto = Array.prototype,
        slice = arrproto.slice,
        push = arrproto.push;


    function each( obj, fn, ctx ) {

        var al = arguments.length,
            isarr = obj.length != null,
            i,
            l;

        if ( isarr ) {
            i = 0;
            l = obj.length;
            if ( l !== 0 )
                for ( ; i < l; i++ )
                    fn.call( ctx, obj[ i ], i, i === ( l - 1 ) );
        } else
            for ( i in obj )
                fn.call( ctx, obj[ i ], i );

        return obj;
    }

    function extend( target ) {

        var z,
            i = 1,
            arg = arguments,
            l = arg.length;

        if ( l > 1 )
            for ( ; i < l; i++ )
                for ( z in arg[ i ] )
                    target[ z ] = arg[ i ][ z ];

        return target;
    }

    function map( obj, fn ) {
        var likearr = Array.isArray( obj ),
            ret = [],
            i,
            l;

        if ( likearr ) {
            i = 0;
            l = obj.length;

            if ( l !== 0 )
                for ( ; i < l; i++ )
                    ret.push( fn( obj[ i ], i ) );
        } else {
            for ( i in obj )
                ret.push( fn( obj[ i ], i ) );
        }

        return ret;
    }

    function filter( obj, fn ) {
        var likearr = Array.isArray( obj ),
            ret = [],
            i,
            l,
            curVal,
            curRes;

        if ( likearr ) {
            i = 0;
            l = obj.length;

            if ( l !== 0 ) {
                for ( ; i < l; i++ ) {
                    curVal = obj[ i ];
                    curRes = fn( curVal, i );
                    if ( curRes )
                        ret.push( curVal );
                }
            }
        } else {
            for ( i in obj ) {
                curVal = obj[ i ];
                curRes = fn( curVal, i );
                if ( curRes )
                    ret.push( curVal );
            }
        }

        return ret;
    }

    function isFunction( fn ) {
        return typeof fn === 'function';
    }


    function isEmpty( obj ) {
        var i;
        for ( i in obj )
            return false;
        return true;
    }

    function toObject( arrMap ) {
        var res = {},
            l = arrMap.length;

        while ( l-- ) res[ arrMap[ l ][ 0 ] ] = arrMap[ l ][ 1 ];

        return res;
    }

    function toArray( arg ) {

        var l = arg.length,
            res = [];

        if ( l === 1 )
            res = [ arg[ 0 ] ];
        else
            while ( l-- ) res[ l ] = arg[ l ];


        return res;
    }

    function getResource( path, callback ) {
        return ajax( {
            type: 'GET',
            url: appData.IS_GVIK ? ( appData.APP_PATH + path ) : chrome.extension.getURL( path )
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

        var fileName,
            script,
            elem = document.head || document.documentElement;
        ( function require() {

            if ( script && script.parentNode )
                script.parentNode.removeChild( script );

            if ( !( fileName = _scripts.shift() ) ) {
                return callback && callback();
            }

            script = document.createElement( 'script' );
            script.charset = 'utf-8';
            script.src = ( data.path || '' ) + fileName + ( ( data.suffix ) ? '?' + data.suffix : '' );

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

    function ajax( data, callback, error, async ) {


        var xhr = new XMLHttpRequest(),
            type = data.type || 'GET',
            fn,
            dataArg;

        xhr.open( type, data.url, async ? false : true );

        if ( type === 'HEAD' ) {
            fn = function() {
                callback( data.getheader ?
                    this.getResponseHeader( data.getheader ) :
                    this.getAllResponseHeaders() );
            };
        } else {

            fn = function() {
                if ( xhr.status >= 200 && xhr.status < 300 ) {
                    var ctype = this.getResponseHeader( 'Content-Type' ) || '',
                        res = this.responseText;
                    if ( ctype.indexOf( 'application/json' ) !== -1 || data.dataType === 'json' ) {
                        try {
                            res = JSON.parse( res );
                        } catch ( e ) {}
                    }
                    if ( callback )
                        return callback( res );
                } else
                    error( xhr.status, xhr.statusText, this.getAllResponseHeaders() );
            };

            xhr.addEventListener( 'error', error, false );

            if ( type === 'POST' ) {

                xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
                xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

                if ( !isEmpty( data.data ) ) {
                    dataArg = map( data.data, function( v, k ) {
                            return encodeURIComponent( k ) + '=' + encodeURIComponent( v );
                        } )
                        .join( '&' );
                }

            }
        }

        xhr.addEventListener( 'load', fn, false );

        xhr.send( dataArg );

        return xhr;
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


    Add( 'core', {
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
        ajax: ajax

    } );

} );