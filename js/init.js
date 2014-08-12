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

        this.DEBUG = true;
    }


    var gvik = new GViK();

    var _modules = {};

    var MANIFEST = JSON.parse( sessionStorage.manifest ),
        CONFIGS = JSON.parse( sessionStorage.options ),
        DEFAULT_CONFIGS = JSON.parse( sessionStorage.configs ),
        files = MANIFEST.web_accessible_resources,


        rmodulename = /js\/plugin\/([^\/]+)\/.+\.js$/,
        rmodulename2 = /\/([^\/]+)\.js$/;

    // remove init.js
    files.shift();



    gvik.VERSION = MANIFEST.version;
    gvik.VERSION_INT = gvik.VERSION.replace( /\./g, '' );
    gvik.AUTHOR = MANIFEST.author;


    gvik.OS = navigator.platform.match( /^[a-z]+/i ).pop();

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

    GViK.prototype.GetConfig = function( namespace, options ) {
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


    GViK.prototype.get = function() {
        return _modules;
    }

    var getModuleName = function( fileName ) {
            var res = fileName.match( rmodulename ) || fileName.match( rmodulename2 );
            console.log( res );
            return res ? res.pop().replace( /\//g, '.' ) : 'null';
        },

        isdisabledmodule = function( fileName ) {
            var moduleName = getModuleName( fileName ),
                result = gvik.GetConfig( moduleName, 'enable' );

            if ( result !== false ) {
                _modules[ moduleName ] = true;
            }

            return result === false;
        },

        findExt = function( fls, ext ) {
            return fls.filter( function( c ) {
                return ( c.length - ext.length ) === c.indexOf( ext )
            } )
        },

        issys = /^(?:js\/lib\/|engine\/)/,

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


    GViK.prototype.Define = function( _scripts, callback, userScr ) {
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


    function GViKModule() {


        this.Check = function( obj, modulename, fn ) {

            if ( typeof obj === 'function' ) {
                return obj.call( gvik, gvik, _modules, SECKEY );
            }

            if ( typeof modulename === 'function' ) {
                return modulename.call( gvik, gvik, _modules, SECKEY );
            }

            for ( var i in modulename ) {
                if ( !_modules[ modulename[ i ] ] ) {
                    return;
                }
            }

            for ( var i in obj ) {
                if ( !gvik.GetConfig( i, obj[ i ] ) )
                    return;
            }

            fn.call( gvik, gvik, _modules, SECKEY );

        };


        this.Add = function( key, val ) {

            if ( typeof key === 'string' ) {
                GViK.prototype[ key ] = typeof val === 'function' ? val.call( gvik ) : val;
                //_modules[ key ] = true;
                return;
            }

            var i, c;

            for ( i in key ) {
                c = key[ i ];
                //_modules[ i ] = true;
                GViK.prototype[ i ] = typeof c === 'function' ? c.call( gvik ) : c;
            }
        };
    }

    var SECKEY = Date.now().toString() + Math.random().toString();



    window.GViKModule = new GViKModule();

    if ( gvik.DEBUG ) {
        window.gvik = new GViK();
    }


    var init = function() {

        if ( window.vk == undefined ) {
            return setTimeout( init, 15 );
        }

        if ( !window.vk.id ) {
            return setTimeout( init, 5000 );
        }

        gvik.UNIQ_ID = window.vk.id;

        gvik.Define( scripts.api, function() {
            gvik.Define( scripts.other, function() {
                gvik.event.trigger( gvik.OS );
            }, true );
        } );
    };

    init();



}() );