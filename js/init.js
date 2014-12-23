/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


+( function() {

    "use strict";

    if ( window.gvik || window._GViK ) {
        return;
    }

    var

        MANIFEST = JSON.parse( sessionStorage.manifest ),
        CONFIGS = JSON.parse( sessionStorage.options ),
        files = MANIFEST.web_accessible_resources,

        _modules = {},

        rmodulename = /js\/plugin\/([^\/]+)\/.+\.js$/,
        rmodulename2 = /\/([^\/]+)\.js$/;

    // remove init.js
    files.shift();



    function GViK() {
        this.APP_PATH = sessionStorage.apppath;
        this.APP_ID = sessionStorage.appid;
        this.IS_GVIK = true;

        this.DEBUG = false;

        this.VERSION = MANIFEST.version;
        this.VERSION_INT = this.VERSION.replace( /\./g, '' );
        this.AUTHOR = MANIFEST.author;

        this.OS = navigator.platform.match( /^[a-z]+/i ).pop();

    }

    var gvik = new GViK();


    GViK.prototype.getID = function() {
        return window.vk.id;
    };



    var issys = /^(?:js\/lib\/|engine\/)/,

        scripts = ( function() {
            var api = [],
                other = [],

                i = 0,
                l = files.length,

                file;

            for ( ; i < l; i++ ) {

                file = files[ i ];

                if ( ( file.length - 3 ) === file.indexOf( '.js' ) ) {
                    issys.test( file ) ?
                        api.push( file ) :
                        other.push( file );
                }
            }

            return {
                api: api,
                other: other
            }

        }() );


    function define( _scripts, callback, userScr ) {
        _scripts = Array.isArray( _scripts ) ? _scripts : [ _scripts ];

        var fileName,
            script,
            _cacheKey = gvik.DEBUG ? Date.now() + Math.random() : '',
            require = function() {

                if ( !( fileName = _scripts.shift() ) ) {
                    return callback && callback();
                }

                if ( userScr && _isDisabledModule( fileName ) ) {
                    return require();
                }

                script = document.createElement( 'script' );
                script.charset = 'utf-8';

                script.src = gvik.APP_PATH + fileName + '?' + gvik.VERSION + _cacheKey;

                script.async = true;
                script.defer = true;
                script.addEventListener( 'load', function() {
                    this.parentNode.removeChild( this );
                    require();
                }, false );
                document.head.appendChild( script );
            };

        require();
    };

    var domReady = false;
    var apiLoaded = false;

    function _GViK() {}


    function _getModuleName( fileName ) {
        var res = fileName.match( rmodulename ) || fileName.match( rmodulename2 );
        return res ? res.pop().replace( /\//g, '.' ) : 'null';
    }


    function _isDisabledModule( fileName ) {
        var moduleName = _getModuleName( fileName ),
            result = gvik.configs.get( moduleName, 'enable' );

        if ( result !== false ) {
            _modules[ moduleName ] = true;
        }

        return result === false;
    }


    _GViK.prototype.Init = function( obj, modulename, fn ) {
        var _req = function( module ) {
            return gvik[ module ];
        };


        if ( typeof obj === 'function' ) {
            return obj( gvik, _req );
        }


        if ( typeof modulename === 'function' ) {
            return modulename( gvik, _req );
        }



        if ( apiLoaded ) {
            var i;

            for ( i in modulename ) {
                if ( !_modules[ modulename[ i ] ] ) {
                    return;
                }
            }

            for ( i in obj ) {
                if ( !gvik.configs.get( i, obj[ i ] ) ) {
                    return;
                }
            }
        }

        fn( gvik, _req );

    };


    _GViK.prototype.Add = function( key, val ) {

        if ( typeof key === 'string' ) {
            GViK.prototype[ key ] = typeof val === 'function' ?
                val.call( gvik, gvik ) :
                val;
            return;
        }

        var i, c;

        for ( i in key ) {
            c = key[ i ];
            GViK.prototype[ i ] = typeof c === 'function' ?
                c.call( gvik, gvik ) :
                c;
        }
    };

    _GViK.prototype.get = function() {
        return gvik;
    };

    window._GViK = new _GViK();

    function init() {
        if ( gvik.getID() === 0 )
            return setTimeout( init, 5000 );
        gvik.chrome.pushID();
        define( scripts.other, 0, true );
    }

    function onDomReady() {
        if ( domReady ) return;
        domReady = true;
        init();
    };


    define( scripts.api, function() {
        gvik.configs.load( CONFIGS );
        apiLoaded = true;
        document.addEventListener( 'DOMContentLoaded', onDomReady, false );
        if ( document.body ) onDomReady();
    } );


}() );