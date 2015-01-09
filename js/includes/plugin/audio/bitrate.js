/*
 
 
 
 
 */



_GViK( {
        'audio': [
            'download-enable',
            'add-bit'
        ]
    },
    function( appData, require, Add ) {

        "use strict";

        var core = require( 'core' ),
            dom = require( 'dom' ),
            event = require( 'event' ),
            global = require( 'global' ),
            options = require( 'options' ),
            cache = require( 'cache' ),
            chrome = require( 'chrome' );


        function __getFilesSize( url, callback ) {

            chrome.ajax( {
                    type: 'HEAD',
                    url: url,
                    getheader: 'Content-Length'
                }, function( contentLenght ) {
                    callback( contentLenght );
                },
                function() {
                    callback( 0 );
                }, false );

        }


        function __calcBitrate( size, dur, needFileSize ) {
            var bitInt = ( ( size * 8 ) / dur / 1000 ) | 0,
                sizeInt = size / ( 1024 * 1024 ) | 0,
                formated = bitInt + 'kbps';

            if ( needFileSize ) {
                formated += ', ' + sizeInt + 'MB';
            }

            return {
                formated: formated,
                bitInt: bitInt,
                size: size,
                sizeInt: sizeInt
            };
        }



        var
            CONFS = options.get( 'audio' ),

            FILE_SIZE_ENABLED = CONFS.get( 'file-size' ),
            LOADER_DISABLED = CONFS.get( 'loader-disable' ),

            CLASS_BITRATE = [ 'gvik-bitrate', ( LOADER_DISABLED ? '' : ' loader' ) ].join( '' ),
            NAME_ATTR = [ 'data-gvik-bitrate', ( FILE_SIZE_ENABLED ? '-filesize' : '' ) ].join( '' ),

            AUDIO_SELECTOR = '.audio:not([id=audio_global]):not([' + NAME_ATTR + '])',
            SORT_AUDIO_SELECTOR = '.audio:not([id=audio_global])[' + NAME_ATTR + ']',

            SORT_PROP = "bitInt",

            HIDE_SMALL_BIT_FN = CONFS.get( 'auto-hide-bit' ) ? function( audios ) {
                for ( var i = audios.length; i--; ) {
                    if ( getCacheInt( audios[ i ].id ) > 260 )
                        break;

                    audios[ i ].style.display = "none";
                }
            } : null,

            AUTO_LOAD_BIT_FN = CONFS.get( 'auto-load-bit' ) ? function( bitrateEl, res, audioEl ) {
                if ( window.cur.searchStr ) {
                    clearTimeout( tId );
                    tId = setTimeout( function() {
                        var audios = [].slice.call( window.cur.sContent.querySelectorAll( SORT_AUDIO_SELECTOR ) ).sort( function( a, b ) {
                            return getCacheInt( b.id ) - getCacheInt( a.id );
                        } );

                        if ( !audios.length ) return;

                        HIDE_SMALL_BIT_FN && HIDE_SMALL_BIT_FN( audios );

                        dom.append( window.cur.sContent, audios );
                    }, 100 );
                }
            } : null;



        function getCacheInt( id ) {
            return ( cache.get( id ) || {} )[ SORT_PROP ] || 0;
        }


        function __getBitrate( url, dur, callback, needFileSize, id ) {

            var res = cache.get( id );

            if ( res ) {
                callback( res, true );
                return 'gvik-bitrate';
            }

            __getFilesSize( url, function( size ) {
                if ( size ) return callback( __calcBitrate( size, dur, needFileSize, id ) );
            } );

            return CLASS_BITRATE;
        }


        global.VARS.GET_BITRATE = __getBitrate;

        var tId;


        function setBitrate( audioEl, callback ) {

            audioEl.setAttribute( NAME_ATTR, true );

            var data = global.VARS.PARSE_AUDIO_DATA( audioEl ),
                bitrateEl = document.createElement( 'div' );

            data.act.appendChild( bitrateEl );

            bitrateEl.className = __getBitrate( data.url, data.dur, function( res, fromCache ) {

                if ( fromCache ) {
                    //
                } else
                if ( !LOADER_DISABLED ) bitrateEl.classList.remove( 'loader' );

                bitrateEl.innerText = res.formated;

                res.url = data.url;
                res.dur = data.dur;
                res.id = data.id;

                if ( !cache.has( data.id ) ) cache.set( data.id, res );

                if ( callback ) callback( bitrateEl, res, audioEl );

            }, FILE_SIZE_ENABLED, data.id );

        }



        event.bind( [
            'audio.newRows',
            'audio',
            'padOpen'
        ], function() {

            var audios = dom.queryAll( AUDIO_SELECTOR ),
                i = 0,
                l = audios.length;

            for ( ; i < l; i++ )
                setBitrate( audios[ i ], AUTO_LOAD_BIT_FN );
        }, true );

        dom.setDelegate( document, AUDIO_SELECTOR, {
            mouseover: function( el ) {
                setBitrate( el );
            }
        } );

    } );