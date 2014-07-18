/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

;
( function() {

    "use strict";

    if ( window.gvik ) {
        return;
    }

    function GViK() {
        this.APP_PATH = sessionStorage.apppath;
        this.APP_ID = sessionStorage.appid;
        this.IS_GVIK = true;
    }

    GViK.prototype.Add = function( key, val ) {

        if ( typeof key === 'string' ) {
            this[ key ] = typeof val === 'function' ? val() : val;
            return;
        }

        var i, c;

        for ( i in key ) {
            c = key[ i ];
            this[ i ] = typeof c === 'function' ? c() : c;
        }
    };

    window.gvik = new GViK();

    var MANIFEST = JSON.parse( sessionStorage.manifest ),
        CONFIGS = JSON.parse( sessionStorage.options ),
        DEFAULT_CONFIGS = JSON.parse( sessionStorage.configs ),
        files = MANIFEST.web_accessible_resources;

    // remove init.js
    files.shift();



    gvik.VERSION = MANIFEST.version;
    gvik.VERSION_INT = gvik.VERSION.replace( /\./g, '' );
    gvik.AUTHOR = MANIFEST.author;

    gvik.CONFIGS = {};

    for ( var i in DEFAULT_CONFIGS ) {
        var curData = DEFAULT_CONFIGS[ i ];
        gvik.CONFIGS[ i ] = {};

        for ( var z in curData ) {
            if ( CONFIGS[ i ] && CONFIGS[ i ].hasOwnProperty( z ) ) {
                gvik.CONFIGS[ i ][ z ] = CONFIGS[ i ][ z ];
            } else {
                gvik.CONFIGS[ i ][ z ] = curData[ z ];
            }
        }
    }

    gvik.GetConfig = function( namespace, options ) {
        var val = gvik.CONFIGS[ namespace ];

        if ( !options ) {
            return {
                get: function( k ) {
                    return val ? val[ k ] : null;
                },

                has: function() {
                    return val.hasOwnProperty( k );
                }
            };
        }

        return val ? val[ options ] : null;
    };

    var rmodule = /([\w]+)\.js$/,

        getmodulename = function( fileName ) {
            var res = fileName.match( rmodule )
            return res ? res[ 1 ] : null;
        };

    var isdisabledmodule = function( fileName ) {
        return gvik.GetConfig( getmodulename( fileName ), 'enable' ) === false;
    };

    var findExt = function( fls, ext ) {
        return fls.filter( function( c ) {
            return ( c.length - ext.length ) === c.indexOf( ext )
        } )
    };

    var issys = /^(?:js\/lib\/|engine\/)/,

        scripts = ( function() {
            var fileList = findExt( files, '.js' ),
                api = [],
                other = [],
                i = 0,
                file;

            while ( ( file = fileList[ i++ ] ) ) {
                issys.test( file ) ?
                    api.push( file ) :
                    other.push( file )
            }

            return {
                api: api,
                other: other
            }

        }() );


    gvik.Define = function( _scripts, callback, userScr ) {
        _scripts = Array.isArray( _scripts ) ? _scripts : [ _scripts ];

        var fileName,
            script,
            require = function() {

                if ( !( fileName = _scripts.shift() ) ) {
                    return callback && callback();
                }

                if ( userScr && isdisabledmodule( fileName ) ) {
                    return require();
                }

                script = document.createElement( 'script' );
                script.charset = 'utf-8';

                script.src = gvik.APP_PATH + fileName + '?' + gvik.VERSION;
                script.type = 'text/javascript';
                script.async = true;
                script.addEventListener( 'load', function() {
                    this.parentNode.removeChild( this );
                    require();
                }, false );
                document.head.appendChild( script );
            };

        require();
    };


    var init = function() {

        if ( window.vk == undefined ) {
            return setTimeout( init, 15 );
        }

        if ( !window.vk.id ) {
            return setTimeout( init, 5000 );
        }

        gvik.UNIQ_ID = window.vk.id;

        gvik.Define( scripts.api, function() {
            gvik.Define( scripts.other, null, true );
        } );
    };

    init();

}() );