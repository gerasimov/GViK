/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


"use strict";



GViKModule.Check( {}, [], function( gvik ) {

    gvik.event.on( 'disconnect', null, function() {
        if ( typeof gvik !== 'undefined' && gvik.DEBUG ) console.log( 'disconnected GViK! Please reload VK pages!' )
    } );

    gvik.event.DOMLoad( function() {

        document.body.setAttribute( 'data-gvik-options', gvik.core.filter( {
                'audio-out-hide': '_hide-bit_',
                'common-remove-ads': '_ads_',
                'common-remove-white-heart': '_heart_',
                'common-mark-red-type-vote': '_mark-red_',
                'common-remove-status': '_hide-status_'
            }, function( v, k ) {
                var keys = k.split( /-/g );
                return !gvik.GetConfig( keys.shift(), keys.join( '-' ) )
            } )
            .join( '' ) );

    } );

    if ( gvik.GetConfig( 'groups', 'fast-exit' ) ) {

        gvik.dom.setDelegate( document, '.group_list_row:not([data-gvik])', 'mouseover', function( el ) {

            el.setAttribute( 'data-gvik', 'true' );

            var child,
                infRow,
                but;

            if ( !( infRow = el.querySelector( '.group_row_info' ) ) ) {
                return;
            }

            but = gvik.dom.create( 'span', {
                prop: {
                    className: 'gvik-exit-group'
                },
                events: {
                    click: function() {
                        gvik.vkapi.call( 'execute.groupLeave', {
                            gid: ( /\d+/.exec( el.id )[ 0 ] )
                        }, function() {
                            el.parentNode.removeChild( el );
                        } );
                    }
                }
            } );

            gvik.dom.after( infRow, but );

        } );

    }

    if ( gvik.GetConfig( 'audio', 'download-enable' ) ) {

        var getData = function( audio ) {

                var input = audio.getElementsByTagName( 'input' )[ 0 ];

                if ( !input ) {
                    return;
                }

                var data = input.value.split( ',' );

                return {
                    act: audio.getElementsByClassName( 'actions' )[ 0 ],
                    url: data[ 0 ],
                    dur: data[ 1 ]
                };

            },

            confs = gvik.GetConfig( 'audio' ),

            OPTS_bit = confs.get( 'add-bit' ) ? '_bit_' : '',
            OPTS_but = confs.get( 'add-but' ) ? '_but_' : '',
            OPTS_size = confs.get( 'file-size' ) ? '_size_' : '',


            normalName = confs.get( 'normal-name' ),
            fromCache = confs.get( 'download-fromCache' ),
            saveAs = confs.get( 'download-saveAs' ),

            setDownloadButton = function( audio, op ) {

                var data = getData( audio );

                audio.setAttribute( 'data-gvik', audio.hasAttribute( 'data-gvik' ) ? OPTS : OPTS_but );

                if ( !data.url ) {
                    return;
                }

                var but = document.createElement( 'div' ),
                    a = document.createElement( 'a' );

                but.className = 'gvik-download';


                if ( normalName ) {

                    var info = audio.getElementsByClassName( 'info' )[ 0 ],
                        artist = info.getElementsByTagName( 'b' )[ 0 ],
                        title = artist.nextElementSibling,
                        fn,

                        fileName = artist.innerText + ' - ' + title.innerText + '.mp3';

                    fn = function( e ) {
                        e.stopPropagation();
                        gvik.chrome.download[ fromCache ?
                            'downloadFromCache' :
                            'download' ]( {
                            url: data.url,
                            filename: fileName,
                            saveAs: saveAs
                        } );
                    };


                } else {
                    a.setAttribute( 'download', '' );
                    a.href = data.url;
                    fn = function( e ) {
                        e.stopPropagation();
                    };
                }

                but.addEventListener( 'click', fn, false );

                but.appendChild( a );
                a.appendChild( document.createElement( 'div' ) );

                data.act.appendChild( but );

                return data
            },

            fileSize = confs.get( 'file-size' ),

            calcBit = function( dur, len ) {

                var intBit = ( ( len * 8 ) / ( dur || 1 ) / 1000 ) | 0,
                    bit = intBit + 'kbps';

                if ( fileSize ) {
                    bit += ', ' + ( ( len / ( 1024 * 1024 ) ) | 0 ) + 'MB';
                }

                return {
                    intBit: intBit,
                    bit: bit
                };
            },

            cache = {},
            cacheInt = {},


            _clearCache = function() {
                cache = {};
                cacheInt = {};
                setTimeout( _clearCache, 1000 * ( 30 * 60 ) );
            };

        _clearCache();

        var disableLoader = confs.get( 'loader-disable' ),
            __BITRATE_CLASS = disableLoader ? 'gvik-bitrate' : 'gvik-bitrate loader',

            processAudio = function( audioEl, bit, bitEl, callback, isCache ) {
                bitEl.innerText = bit;

                if ( !disableLoader || !isCache ) {
                    bitEl.classList.remove( 'loader' );
                }

                callback && callback()
            },

            getAudioSize = function( url, callback, error ) {
                gvik.chrome.simpleAjax( {
                        type: 'HEAD',
                        url: url,
                        getheader: 'Content-Length'
                    }, callback,
                    error );
            },

            getCache = function( id ) {
                return cache[ id ] ||
                    cache[ id + '_pad' ] ||
                    cache[ id.slice( 0, -4 ) ];
            },

            getCacheInt = function( id ) {
                return cacheInt[ id ] ||
                    cacheInt[ id + '_pad' ] ||
                    cacheInt[ id.slice( 0, -4 ) ];
            },

            getBitrate = function( obj, audioEl, callback ) {

                var bitrate = document.createElement( 'div' );
                bitrate.className = __BITRATE_CLASS;
                obj.act.appendChild( bitrate );

                var id = audioEl.id,
                    curCacheRes = getCache( id );

                if ( curCacheRes ) {
                    return processAudio( audioEl, curCacheRes, bitrate, callback, true );
                }

                getAudioSize( obj.url, function( len, b ) {

                    if ( !( b = calcBit( obj.dur, len, audioEl ) )
                        .intBit ) {
                        return;
                    }

                    cache[ id ] = b.bit;
                    cacheInt[ id ] = b.intBit;

                    processAudio( audioEl, b.bit, bitrate, callback );
                }, function() {
                    processAudio( audioEl, 'Error', bitrate, callback );
                } );
            },

            OPTS = OPTS_bit + OPTS_but + OPTS_size,

            OPTS_bit_size = OPTS_bit + OPTS_size,

            setBitrate = function( audio, data, callback ) {
                if ( !audio ) {
                    return;
                }
                audio.setAttribute( 'data-gvik', audio.hasAttribute( 'data-gvik' ) ? OPTS : OPTS_bit_size );

                if ( data = ( data && data.url ) ? data : getData( audio ) ) {
                    getBitrate( data, audio, callback );
                }
            },
            setBitrateWithChild = function( el ) {
                setBitrate( gvik.dom.parent( el, '.audio' ) );
            },

            AUDIO_SELECTOR = '.audio:not(#audio_global)',

            __addEvent = function( selector, filter, fn ) {
                gvik.dom.setDelegate( document, AUDIO_SELECTOR + ':not([data-gvik' + filter + ']) ' + ( selector || '' ), 'mouseover', fn );
            };

        if ( confs.get( 'add-but' ) ) {
            if ( confs.get( 'add-bit' ) ) {
                if ( confs.get( 'bitrate-audio' ) ) {
                    __addEvent( null, '*=_but_', function() {
                        this.hasAttribute( 'data-gvik' ) ?
                            setDownloadButton( this ) :
                            setBitrate( this, setDownloadButton( this ) );
                    } )

                } else if ( confs.get( 'bitrate-downloadBtn' ) ) {
                    __addEvent( '.gvik-download', '^=_bit_', setBitrateWithChild );
                }
            }

            if ( !confs.get( 'add-bit' ) || !confs.get( 'bitrate-audio' ) ) {
                __addEvent( null, '*=_but_', setDownloadButton );
            }
        }

        if ( confs.get( 'add-bit' ) ) {
            if ( !confs.get( 'add-but' ) ) {
                if ( confs.get( 'bitrate-audio' ) ) {
                    __addEvent( null, '^=_bit_', function() {
                        setBitrate( this );
                    } );
                }
            }

            if ( confs.get( 'bitrate-playBtn' ) ) {
                __addEvent( '.play_new', '^=_bit_', setBitrateWithChild );
            }

            if ( confs.get( 'auto-load-bit' ) ) {

                var autoHide = confs.get( 'auto-hide-bit' ),
                    sId,

                    _sortAudio = function( el ) {

                        if ( !el ) {
                            return;
                        }

                        var sorted = gvik.core.toArray( el.querySelectorAll( AUDIO_SELECTOR + '[data-gvik*=_bit_]' ) )
                            .sort( function( a, b ) {
                                var first = getCacheInt( a.id ),
                                    second = getCacheInt( b.id );
                                return second - first;
                            } );

                        gvik.dom.append( el, sorted );
                    },

                    sortAudio = function() {
                        if ( cur.searchStr || cur.q ) {
                            var padS = document.getElementById( 'pad_search_list' );
                            if ( padS ) {
                                _sortAudio( padS );
                            } else {
                                _sortAudio( cur.sContent );
                            }
                        }
                    },

                    minBit = parseInt( confs.get( 'min-bitrate' ) );


                if ( isNaN( minBit ) || minBit < 128 || minBit > 320 ) {
                    minBit = 256;
                }

                var hideSmallBit = function() {
                        if ( cur.sContent )
                            gvik.core.each( cur.sContent.querySelectorAll( AUDIO_SELECTOR + ':not(.gvik-none)[data-gvik^=_bit_]' ), function( el ) {
                                if ( getCacheInt( el.id ) < minBit ) {
                                    el.classList.add( 'gvik-none' );
                                }
                            }, true )
                    },

                    __TIMEOUT = 70,

                    _resetSortTimer = function() {
                        clearTimeout( sId );
                        sId = setTimeout( function() {
                            if ( autoHide ) {
                                hideSmallBit();
                            }
                            sortAudio();
                        }, __TIMEOUT );
                    },

                    lastState = -1,
                    autoSort = confs.get( 'auto-sort-bit' ),
                    setBitrateAll = function( callback, dis ) {

                        var res = document.querySelectorAll( AUDIO_SELECTOR + ':not(.gvik-none):not([data-gvik^=_bit_])' ),
                            curState = window.cur.has_more;


                        if ( !res.length ) {
                            if ( autoSort ) {
                                if ( lastState != curState && curState == 0 ) {
                                    lastState = curState;
                                    sortAudio();
                                }
                            }
                            return;
                        }

                        var i = 0,
                            l = res.length,
                            cb = autoSort ?
                            _resetSortTimer :
                            ( autoHide && hideSmallBit );

                        for ( ; i < l; i++ ) {
                            setBitrate( res[ i ], null, cb );
                        }
                    },
                    _resetBitrateTimer = setBitrateAll,

                    bindFn = function( key, data ) {
                        var fn = window.Audio[ key ];
                        if ( !fn ) {
                            return;
                        }
                        if ( !fn._set ) {
                            var __fn = function() {
                                fn.apply( this, arguments );
                                _resetBitrateTimer( this, arguments );
                            };

                            __fn._set = true;
                            window.Audio[ key ] = __fn;
                        }
                    };

                gvik.event.bind( [ 'audio', 'padOpen', 'DOMLoad' ], function() {
                    if ( !window.Audio ) {
                        return;
                    }
                    bindFn( 'showRows' );
                    bindFn( 'scrollCheck' );
                    _resetBitrateTimer();
                } );
            }
        }
    }


    if ( gvik.GetConfig( 'audio', 'faster' ) ) {
        gvik.event.bind( [ 'audio', 'DOMLoad' ], function() {
            if ( window.sorter && window.sorter.added ) {
                window.sorter.added = function() {};
            }
        } );
    }

    gvik.event.IM( function( e ) {
        var cfs = gvik.GetConfig( 'im' );
        if ( cfs.get( 'mark-read' ) ) {
            IM.markRead = function( uid, msgIds ) {};
            IM.markPeer = function() {};
        }
        if ( cfs.get( 'send-notify' ) ) {
            IM.onMyTyping = function( uid ) {};
        }
    } );

    if ( gvik.GetConfig( 'common', 'state-onlineChange' ) ) {

        if ( gvik.GetConfig( 'common', 'set-offline' ) ) {
            gvik.event.bind( [ 'changePage', 'DOMLoad' ], function() {
                gvik.vkapi.call( 'account.setOffline' );
            } );
        } else if ( gvik.GetConfig( 'common', 'set-online' ) ) {
            var _cerr = 0,
                fn = function() {
                    gvik.vkapi.call( 'account.setOnline', {}, function() {
                        setTimeout( fn, ( 14 * 60 ) * 1000 );
                        _cerr = 0;
                    }, function() {
                        if ( _cerr < 4 ) {
                            fn();
                        }
                        _cerr++;
                    } );
                };

            gvik.event.DOMLoad( fn );
        }
    }

    if ( gvik.GetConfig( 'video', 'download-enable' ) ) {

        var isurl = /^url(\d+)$/,
            res,
            parseVideoData = function( vars ) {
                var actcont = document.querySelector( '#mv_actions:not([data-gvikset])' );
                if ( !actcont ) {
                    return;
                }
                gvik.dom.setData( actcont, 'gvikset', '' );

                gvik.dom.append( actcont, gvik.core.map( Object.keys( vars ), function( val ) {
                    if ( ( res = val.match( isurl ) ) )
                        return gvik.dom.create( 'a', {
                            prop: {
                                href: vars[ val ],
                                download: vars.md_title,
                                innerText: 'Скачать ' + res[ 1 ]
                            }
                        } );
                } ) );
            },
            varsToObject = function( vars ) {
                return gvik.core.toObject( gvik.core.map( vars.split( /\&/g ), function( val ) {
                    return decodeURIComponent( val )
                        .split( '=' );
                } ) );
            };

        gvik.event.DOMLoad( function() {
            var vp = document.getElementById( 'video_player' );

            if ( vp ) {
                parseVideoData( varsToObject( vp.getAttribute( 'flashvars' ) ) );
            }

            if ( !window.renderFlash ) {
                return;
            }
            var rf = window.renderFlash;
            window.renderFlash = function() {
                parseVideoData( arguments[ 3 ] );
                return rf.apply( this, arguments );
            }
        } )
    }



    if ( gvik.GetConfig( 'system', 'enable-qicksett' ) ) {

        gvik.event.on( "changeURL", null, function() {
            gvik.chrome.sendRequest( "showPageAction", {} );
        } );

        gvik.event.trigger( "changeURL" );

        gvik.event.DOMLoad( function() {
            window.hab.setLoc = window.hab.setLoc.bindFuncAfter( function() {
                gvik.event.trigger( "changeURL" );
            } );
        } );
    }


    gvik.chrome.ga( 'send', 'event', 'vk', 'init' );


    gvik.event.DOMLoad( function() {
        document.body.setAttribute( 'data-gvik-os', gvik.OS );
    } );

    gvik.event.on( 'Win', 0, function() {} );

    gvik.event.on( 'Linux', 0, function() {

    } );

} );