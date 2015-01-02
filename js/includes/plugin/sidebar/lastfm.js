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
      event = require( 'event' ),
      chrome = require( 'chrome' ),
      lastfmAPI = require( 'lastfmapi' ),
      launcher = require( 'launcher' ),
      config = require( 'config' ),
      global = require( 'global' ),
      options = require( 'options' ),
      sidebar = require( 'sidebar' ),


      nameArtist,
      nameTrack,
      nameAlbum,
      trackId,
      lastNameTrack = '',
      lastNameArtist = '',
      lastNameAlbum = '',
      albumTrackList = [],
      lastResult,
      lastMbid,
      wrap,
      tabCont,
      topTab,
      albumTab,
      audoNameCont = {},
      locked = false,
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
        item: '<div class="item gvikLastfm" data-duration="<%=duration>" data-trackName="<%=name>">\
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
            duration: curTrack.duration,
            dur: global.VARS.FORMAT_TIME( curTrack.duration ),
            img: album.image[ 1 ][ '#text' ]
          };
        }
      };


    function resetAlbum() {

      dom.empty( albTracksCont );
      albumTab.setAttribute( 'data-label', 'Album' );

      topTab.dispatchEvent( new Event( 'change' ) );
      topTab.checked = true;

      nameAlbum = '';

      tabs.classList.add( 'gvik-none' );
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
      return core.toArray( arguments ).map( function( val ) {
        return val.replace( /(?:[\s,\.\\\/\!\@\#\$\%\^\&\*\(\)\|]+)/g, '' ).toLowerCase();
      } ).join( '-' );
    }

    var __xhr;


    function lfapiCall( method, prop ) {
 

      __xhr = lastfmAPI.call( method, {
        artist: nameArtist || '',
        album: nameAlbum || '',
        track: nameTrack || '',
        correction: 1
      }, function( res, isError ) {
        lastResult = res;
        if ( isError ) return event.trigger( method + '.error' );
        event.trigger( method, res[ prop ] );
      }, function() {
        event.trigger( method + '.error' );

      } );
    }

    function render( tmpl, arr, fn ) {
      if ( arr )
        return arr.map( function( val ) {
          return core.tmpl( tmpl, fn( val ) );
        } ).join( '' );
    }


    event.bind( 'track.getInfo', function( track, evname ) {


      cache.set( getCacheKey( nameArtist, nameTrack, evname ), track );

      if ( !track.album )
        return resetAlbum();


      if ( track.album.title === nameAlbum ) {
        /*       albumTab.dispatchEvent( new Event( 'change' ) );
               albumTab.checked = true;*/
        return;
      }

      nameAlbum = track.album.title;

      if ( cache.has( getCacheKey( nameArtist, nameTrack, 'album.getInfo' ) ) )
        event.trigger( 'album.getInfo', cache.get( getCacheKey( nameArtist, nameAlbum, 'album.getInfo' ) ) );
      else lfapiCall( 'album.getInfo', "album" );

    } )

    .bind( 'artist.getInfo', function( artist, evname ) {

      nameArtist = artist.name;

      cache.set( getCacheKey( nameArtist, evname ), artist );

      labelEl.innerText = artist.name;

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


      if ( cache.has( getCacheKey( nameArtist, 'artist.getTopTracks' ) ) )
        event
        .trigger( 'artist.getTopTracks', cache.get( getCacheKey( nameArtist, 'artist.getTopTracks' ) ) );
      else lfapiCall( 'artist.getTopTracks', "toptracks" );



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
          if ( key !== "noimage" ) html.push( render( TMPL.item, val, TMPL.renderTrack ) );
        } );

        html.push( render( TMPL.item, groups.noimage || [], TMPL.renderTrack ) );


      } else
        html.push( render( TMPL.item, track || [], TMPL.renderTrack ) );


      tracksCont.innerHTML = html.join( '' );

      if ( cache.has( getCacheKey( nameArtist, nameTrack, 'track.getInfo' ) ) )
        event
        .trigger( 'track.getInfo', cache.get( getCacheKey( nameArtist, nameTrack, 'track.getInfo' ) ) );
      else lfapiCall( 'track.getInfo', "track" );


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

      /*    albumTab.dispatchEvent( new Event( 'change' ) );
          albumTab.checked = true;*/

      tabs.classList.remove( 'gvik-none' );

    } )

    .bind( 'newtrack', function( data ) {

      if ( !sidebar.shown )
        sidebar.show();

      showCurTab();
      resetArtist();


      if(__xhr)
        __xhr.abort();
      __xhr = null;



      trackId = data.trackId;
      nameTrack = data.title;
      nameArtist = data.artist;



      if ( cache.has( getCacheKey( nameArtist, 'artist.getInfo' ) ) )
        event
        .trigger( 'artist.getInfo', cache.get( getCacheKey( nameArtist, 'artist.getInfo' ) ) );
      else {
        dom.removeClass( tabCont, 'loaded' );
        lfapiCall( 'artist.getInfo', "artist" );
      }



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

      var searchName = nameArtist + ' – ' + this.getAttribute( 'data-trackname' );

      if ( window.cur.aSearch ) {

        cur.searchTypeChanged( {
          target: {
            index: 0
          }
        }, true );

        cur.searchTypeMenu.value = 0;

        Audio.selectPerformer( {
          from_pad: false,
          event: 0,
          name: searchName
        } );
      } else {
        window.nav.go( 'audio?q=' + searchName );
      }
    } );

  } );