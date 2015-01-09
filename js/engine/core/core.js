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


    function each( obj, fn, likearr ) {

        var al = arguments.length,
            isarr = ( al === 3 ) ? likearr : obj.length != null,
            i,
            l;

        if ( isarr ) {
            i = 0;
            l = obj.length;
            if ( l !== 0 )
                for ( ; i < l; i++ )
                    fn( obj[ i ], i, i === ( l - 1 ) );
        } else
            for ( i in obj )
                fn( obj[ i ], i );

        return obj;
    }

    function extend( target ) {

        var i = 1,
            arg = arguments,
            l = arg.length,

            fnLoop = function( val, key ) {
                target[ key ] = val;
            };

        if ( l > 1 )
            for ( ; i < l; i++ )
                each( arg[ i ], fnLoop );

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
            async: !!callback,
            url: appData.IS_GVIK ? ( appData.APP_PATH + path ) : chrome.extension.getURL( path )
        }, callback );
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

    function ajax( data, callback, error ) {


        var xhr = new XMLHttpRequest(),
            type = data.type || 'GET',
            dataArg;

        xhr.open( type, data.url, true );

        if ( type === 'HEAD' )
            xhr.addEventListener( 'readystatechange', function() {
                if ( this.readyState === XMLHttpRequest.HEADERS_RECEIVED )
                    callback( data.getheader ?
                        this.getResponseHeader( data.getheader ) :
                        this.getAllResponseHeaders() );
            }, false );
        else {

            xhr.addEventListener( 'load', function() {


                if ( xhr.status >= 200 && xhr.status < 300 ) {

                    var ctype = this.getResponseHeader( 'Content-Type' ) || '',
                        res = this.responseText;

                    if ( ctype.indexOf( 'application/json' ) !== -1 || data.dataType === 'json' ) {
                        try {
                            res = JSON.parse( res );
                        } catch ( e ) {}
                    }

                    return callback( res );
                }

                error( xhr.status, xhr.statusText, this.getAllResponseHeaders() );

            }, false );

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

        xhr.send( dataArg );

        return xhr;
    }


    function jsonp() {



    };


    function tmpl( str, obj ) {
        return str.replace( /<\%\=[^>]*>/gi, function( key ) {
            return obj[ key.slice( 3, -1 ) ];
        } );
    }

    function tmpl2( str, obj ) {
        return str.replace( /\%\w/gi, function( key ) {
            return obj[ key.slice( 1 ) ] || '';
        } );
    }



    Add( 'core', {
        extend: extend,
        each: each,
        filter: filter,
        map: map,
        tmpl: tmpl,
        tmpl2: tmpl2,
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