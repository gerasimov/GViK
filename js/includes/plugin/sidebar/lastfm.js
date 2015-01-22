/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( {
        'sidebar': 'lastfm-module'
    }, [
        'lastfm',
        'sidebar'
    ],
    function( appData, require, Add ) {


        "use strict";

        var

            core = require( 'core' ),
            dom = require( 'dom' ),
            cache = require( 'cache' ),
            events = require( 'events' ),
            chrome = require( 'chrome' ),
            lastfmAPI = require( 'lastfmapi' ),
            constants = require( 'constants' ),
            global = require( 'global' ),
            options = require( 'options' ),
            sidebar = require( 'sidebar' ),


            nameArtist,
            nameTrack,
            nameAlbum,

            trackId,

            albumTrackList = [],

            wrap,
            tabCont,
            topTab,
            albumTab,

            showCurTab,

            cnfg = options.get( 'sidebar' );



        var label = 'Last.fm',

            labelEl = dom.create( 'div', {
                prop: {
                    className: 'label',
                    innerText: label
                }
            } ),

            imgEl = dom.create( 'img' ),

            cover = dom.create( 'div', {
                append: imgEl,
                prop: {
                    className: 'cover'
                }
            } ),

            tagsCont = dom.create( 'div', {
                prop: {
                    className: 'tags'
                }
            } ),

            artistInfoCont = dom.create( 'div', {
                prop: {
                    className: 'artistInfo'
                },
                append: [ labelEl, cover, tagsCont ]
            } ),

            tracksCont = dom.create( 'div', {
                prop: {
                    className: 'tracks'
                }
            } ),

            albTracksCont = dom.create( 'div', {
                prop: {
                    className: 'tracks gvik-none'
                }
            } ),

            tabs = dom.create( 'div', {
                prop: {
                    className: 'tabs gvik-none'
                },
                append: [
                    ( topTab = dom.create( 'input', {
                        prop: {
                            className: 'tab',
                            type: 'radio',
                            checked: true,
                            name: 'gvik_lastfm_tabs'
                        },
                        data: {
                            label: 'Top'
                        },
                        events: {
                            change: function() {
                                albTracksCont.classList.add( 'gvik-none' );
                                tracksCont.classList.remove( 'gvik-none' );
                            }
                        }
                    } ) ),

                    ( albumTab = dom.create( 'input', {
                        prop: {
                            className: 'tab',
                            type: 'radio',
                            name: 'gvik_lastfm_tabs'
                        },
                        data: {
                            label: 'Album'
                        },
                        events: {
                            change: function() {
                                tracksCont.classList.add( 'gvik-none' );
                                albTracksCont.classList.remove( 'gvik-none' );
                            }
                        }
                    } ) )
                ]
            } ),

            trackInfoCont = dom.create( 'div', {
                append: [ tabs, tracksCont, albTracksCont ]
            } ),

            TMPL = {
                item: '<div class="item gvikLastfm <%=isCurTrack>" data-duration="<%=duration>" data-trackName="<%=name>">\
            <div class="item-cont">\
                <div class="img-cont">\
                    <div class="img" style="background-image: url(\'<%=img>\');"></div>\
                </div>\
                <div class="label-cont">\
                    <a class="label"><%=name></a>\
                    <span class="duration" ><%=dur></span>\
                </div>\
            </div>\
        </div>',

                tag: '<span class="tag">\
                <a target="_blank" href="<%=url>"><%=tag></a>\
                </span>',

                renderTrack: function( curTrack ) {
                    return {
                        url: curTrack.url,
                        name: curTrack.name,
                        isCurTrack: ( ( curTrack.name === nameTrack ) ? 'cur-track' : '' ),

                        dur: global.VARS.FORMAT_TIME( curTrack.duration ),
                        duration: curTrack.duration,
                        img: ( curTrack.image ? curTrack.image[ 1 ][ '#text' ] : ( appData.APP_PATH + 'img/album.png' ) )
                    };
                },

                renderTag: function( curTag ) {
                    return {
                        url: curTag.url,
                        tag: curTag.name
                    };
                },


                renderAlbumTrack: function( album, curTrack ) {
                    return {
                        url: curTrack.url,
                        name: curTrack.name,
                        isCurTrack: ( ( curTrack.name === nameTrack ) ? 'cur-track' : '' ),
                        duration: curTrack.duration,
                        dur: global.VARS.FORMAT_TIME( curTrack.duration ),
                        img: album.image[ 1 ][ '#text' ]
                    };
                }
            };


        function resetAlbum() {

            dom.empty( albTracksCont );
            albumTab.setAttribute( 'data-label', 'Album' );

            selectTopTab();

            nameAlbum = '';

            tabs.classList.add( 'gvik-none' );
        }


        function selectTab( el ) {
            el.dispatchEvent( new Event( 'change' ) );
            el.checked = true;
        }

        function selectAlbumTab() {
            selectTab( albumTab );
        }

        function selectTopTab() {
            selectTab( topTab );
        }


        function resetArtist() {

            dom.empty( np );
            dom.empty( tracksCont );
            dom.empty( tagsCont );

            trackId = '';

            labelEl.innerText = '';
            imgEl.src = '';

            nameArtist = nameTrack = '';


            cover.style.backgroundImage = 'none';

            resetAlbum();

        }

        function getCacheKey() {
            return core.toArray( arguments ).join( '-' );
        }

        function checkCache( method, prop, cacheArr, clb ) {

            cacheArr.push( method );

            var cacheVal = cache.get( getCacheKey.apply( this, cacheArr ) );


            clb && clb( !!cacheVal );

            if ( cacheVal )
                events.trigger( method, cacheVal );
            else {
                lfapiCall( method, prop );
            }
        }

        var __xhr;


        function lfapiCall( method, prop ) {


            __xhr = lastfmAPI.call( method, {
                artist: nameArtist || '',
                album: nameAlbum || '',
                track: nameTrack || '',
                correction: 1
            }, function( res, isError ) {
                if ( isError ) return events.trigger( method + '.error' );
                events.trigger( method, res[ prop ] );
            }, function() {
                events.trigger( method + '.error' );

            }, true );
        }

        function render( tmpl, arr, fn ) {
            if ( arr )
                return arr.map( function( val ) {
                    return core.tmpl( tmpl, fn( val ) );
                } ).join( '' );
        }


        events.bind( 'track.getInfo', function( track, evname ) {

            nameTrack = track.name;


            cache.set( getCacheKey( nameArtist, nameTrack, evname ), track );

            if ( !track.album )
                return resetAlbum();

            if ( track.album.title === nameAlbum )
                return selectAlbumTab();


            nameAlbum = track.album.title;

            checkCache( 'album.getInfo', 'album', [ nameArtist, nameAlbum ] );

        } )

        .bind( 'artist.getInfo', function( artist, evname ) {


            cache.set( getCacheKey( nameArtist, evname ), artist );
            nameArtist = dom.unes( artist.name );
            labelEl.innerText = nameArtist;

            imgEl.src = artist.image[ 2 ][ '#text' ];

            cover.style.backgroundImage = 'url(' + artist.image[ 2 ][ '#text' ] + ')';


            var tag = ( artist.tags || {} )
                .tag || [];

            if ( !Array.isArray( tag ) ) {
                tag = [ tag ];
            }

            tagsCont.innerHTML = render( TMPL.tag, tag.sort( function( a, b ) {
                return a.name.length < b.name.length ? 1 : 0;
            } ), TMPL.renderTag );

            dom.addClass( tabCont, 'loaded' );

            checkCache( 'artist.getTopTracks', 'toptracks', [ nameArtist ] );

        } )

        .bind( 'artist.getTopTracks', function( responseTracks, evname ) {


            cache.set( getCacheKey( nameArtist, evname ), responseTracks );

            var html = [],
                track = responseTracks.track || [];


            if ( cnfg.get( 'lastfm-groupbyalbum' ) ) {

                var groups = {};

                core.each( track, function( curTrack ) {
                    if ( curTrack.image ) {
                        var img = curTrack.image[ 1 ][ "#text" ];
                        ( groups[ img ] = groups[ img ] || [] ).push( curTrack );
                    } else
                        ( groups.noimage = groups.noimage || [] ).push( curTrack );
                } );


                core.each( groups, function( val, key ) {
                    if ( key !== "noimage" )
                        html.push( render( TMPL.item, val, TMPL.renderTrack ) );
                } );

                html.push( render( TMPL.item, groups.noimage || [], TMPL.renderTrack ) );


            } else
                html.push( render( TMPL.item, track || [], TMPL.renderTrack ) );


            tracksCont.innerHTML = html.join( '' );

            checkCache( 'track.getInfo', 'track', [ nameArtist, nameTrack ] )

        } )

        .bind( 'album.getInfo', function( album, evname ) {

            cache.set( getCacheKey( nameArtist, nameAlbum, evname ), album );

            var albName = [ album.name ];

            if ( album.releasedate ) {
                var res = album.releasedate.trim().match( /\d{4}/ );
                if ( res ) albName.push( res[ 0 ] );
            }

            albumTab.setAttribute( 'data-label', albName.join( ', ' ) );

            if ( !album.tracks || !album.tracks.track )
                return;

            albTracksCont.innerHTML = render( TMPL.item, album.tracks.track, TMPL.renderAlbumTrack.pbind( album ) );

            selectAlbumTab();

            tabs.classList.remove( 'gvik-none' );

        } )

        .bind( 'lastfm.newtrack', function( data ) {


            if ( cnfg.get( 'lastfm-autoshow' ) ) {
                if ( !sidebar.shown )
                    sidebar.show();

                showCurTab();
            }


            if ( __xhr )
                __xhr.abort();
            __xhr = null;



            dom.removeClass( tabCont, 'loaded' );

            trackId = data.trackId;
            nameTrack = data.title;
            nameArtist = data.artist;

            checkCache( 'artist.getInfo', 'artist', [ nameArtist ], function( fromCache ) {

                if ( !fromCache )
                    resetArtist();

                trackId = data.trackId;
                nameTrack = data.title;
                nameArtist = data.artist;

            } );

        } );

        sidebar.addPage( function( _switcher, _tabCont, _wrap, countPage, _showCurTab ) {

            _tabCont.classList.add( 'loaded' );

            wrap = _wrap;
            tabCont = _tabCont;
            showCurTab = _showCurTab;

            _tabCont.id = 'gvik-lastfm';

            dom.append( _tabCont, [ artistInfoCont, trackInfoCont ] );
        } );


        var np = dom.create( 'div', {
            prop: {
                className: 'audio_list'
            },

            style: {
                display: 'none'
            }
        } );

        tabCont.appendChild( np );



        if ( cnfg.get( 'lastfm-searchAndPlay' ) ) {

            tabCont.classList.add( 'searchandplay' );


            dom.setDelegate( tabCont, '.gvikLastfm .img-cont', 'click', function( el, e ) {

                e.stopPropagation();
                e.preventDefault();

                e._canceled = true;

                var _audioEl = dom.parent( e, '.gvikLastfm' );

                require( 'searchandplay' )( {
                    artist: nameArtist,
                    title: _audioEl.getAttribute( 'data-trackname' ),
                    dur: _audioEl.getAttribute( 'data-duration' )
                }, function() {}, {
                    maxbit: cnfg.get( 'lastfm-maxbit' )
                } );
            } );
        }

        dom.setDelegate( tabCont, '.gvikLastfm', 'click', function( el, e ) {

            e.stopPropagation();
            e.preventDefault();

            var searchName = nameArtist + ' – ' + this.getAttribute( 'data-trackname' ),
                from_pad = window._pads.shown == 'mus',
                __cur = window._pads && _pads.cur || window.cur;

            if ( window.cur.aSearch || from_pad ) {

                __cur.searchTypeChanged( {
                    target: {
                        index: 0
                    }
                }, true );

                __cur.searchTypeMenu.value = 0;

                Audio.selectPerformer( {
                    from_pad: from_pad,
                    event: 0,
                    name: searchName
                } );
            } else {
                window.nav.go( 'audio?q=' + searchName );
            }
        } );

    } );