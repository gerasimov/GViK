/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK.Init( function( gvik ) {

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
            if ( l !== 0 ) {
                for ( ; i < l; i++ ) {
                    fn( obj[ i ], i, i === ( l - 1 ) );
                }
            }
        } else
            for ( i in obj )
                fn( obj[ i ], i );

        return obj;
    }

    function extend( target ) {

        var i = 1,
            arg = arguments,
            l = arg.length;

        if ( l > 1 ) {
            for ( ; i < l; i++ ) {
                each( arg[ i ], function( val, key ) {
                    target[ key ] = val;
                } );
            }
        }

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

            if ( l !== 0 ) {
                for ( ; i < l; i++ ) {
                    ret.push( fn( obj[ i ], i ) );
                }
            }
        } else {
            for ( i in obj ) {
                ret.push( fn( obj[ i ], i ) );
            }
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
                    if ( curRes ) {
                        ret.push( curVal );
                    }
                }
            }
        } else {
            for ( i in obj ) {
                curVal = obj[ i ];
                curRes = fn( curVal, i );
                if ( curRes ) {
                    ret.push( curVal );
                }
            }
        }

        return ret;
    }

    function isString() {

    }


    function isFunction( fn ) {
        return typeof fn === 'function';
    }


    function isArray() {

    }

    function isNumber() {

    }


    function isEmpty( obj ) {
        var i;
        for ( i in obj )
            return false;
        return true;
    }

    function toObject( arrMap ) {
        var res = {};
        each( arrMap, function( cArr ) {
            res[ cArr[ 0 ] ] = cArr[ 1 ];
        } );
        return res;
    }

    function toArray( arg ) {
        return ( arg.length === 1 ) ? [ arg[ 0 ] ] : slice.call( arg );
    }

    function getResource( path, callback ) {
        var xhr = new XMLHttpRequest();
        xhr.open( 'GET', gvik.IS_GVIK ? ( gvik.APP_PATH + path ) : chrome.extension.getURL( path ), !!callback );

        if ( callback ) xhr.addEventListener( 'load', function() {
            callback( xhr.responseText );
        }, false );

        xhr.send();
        return xhr.responseText;
    };


    function isPlainObject( obj ) {
        return obj != null && obj.constructor( 0 ) instanceof Number &&
            obj.constructor( '0' ) instanceof String;
    }

    function define( _scripts, callback ) {
        _scripts = Array.isArray( _scripts ) ? _scripts : [ _scripts ];

        var fileName,
            script,
            require = function() {

                if ( !( fileName = _scripts.shift() ) ) {
                    return callback && callback();
                }

                script = document.createElement( 'script' );
                script.charset = 'utf-8';
                script.src = fileName;
                script.async = true;

                script.addEventListener( 'load', require, false );
                document.head.appendChild( script );
            };

        require();
    };

    function ajax( data, callback, error ) {
        var xhr = new XMLHttpRequest(),
            type = data.type || 'GET',
            isHead = type === 'HEAD',
            isPost = isHead ? false : ( type === 'POST' ),
            dataArg;

        xhr.open( type, data.url, true );

        xhr.addEventListener( 'readystatechange', isHead ? function() {
            if ( xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED ) {
                if ( xhr.status >= 200 && xhr.status < 300 ) {
                    return callback( data.getheader ?
                        this.getResponseHeader( data.getheader ) :
                        this.getAllResponseHeaders() );
                }
                error(xhr.status, xhr.statusText, this.getAllResponseHeaders());

            }
        } : function() {
            if ( xhr.readyState === XMLHttpRequest.DONE ) {
                if ( xhr.status >= 200 && xhr.status < 300 ) {
                    var res = this.responseText,
                        ctype = this.getResponseHeader( 'Content-Type' ) || '';

                    if ( ctype.indexOf( 'application/json' ) !== -1 || data.dataType === 'json' ) {
                        res = JSON.parse( res );
                    }
                    return callback( res );
                }
                error(xhr.status, xhr.statusText, this.getAllResponseHeaders());

            }
        }, false );


        if ( isPost ) {
            xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
            xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
            if ( !isEmpty( data.data ) ) {
                dataArg = map( data.data, function( v, k ) {
                    return encodeURIComponent( k ) + '=' + encodeURIComponent( v );
                } )
                    .join( '&' )
            }
        }


        xhr.send( dataArg );
    };

    function tmpl( str, obj ) {
        return str.replace( /\<\%\=[^\>]*\>/gi, function( key ) {
            return obj[ key.slice( 3, -1 ) ];
        } );
    }



    _GViK.Add( 'core', {
        extend: extend,
        each: each,
        filter: filter,
        map: map,
        tmpl: tmpl,
        isPlainObject: isPlainObject,
        isEmpty: isEmpty,
        isFunction: isFunction,
        toObject: toObject,
        toArray: toArray,
        getResource: getResource,
        define: define,
        ajax: ajax,
        isString: isString

    } );

} );