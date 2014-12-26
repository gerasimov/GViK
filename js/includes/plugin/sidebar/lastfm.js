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
      lastfmAPI = require( 'lastfmAPI' ),
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
            dur: global.VARS.FOMAT_TIME( curTrack.duration ),
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
            dur: global.VARS.FOMAT_TIME( curTrack.duration ),
            img: album.image[ 1 ][ '#text' ]
          };
        }
      };


    function resetAlbum() {
      dom.empty( albTracksCont );
      albumTab.setAttribute( 'data-label', 'Album' );
      topTab.dispatchEvent( new Event( 'change' ) );
      topTab.checked = true;

      tabs.classList.add( 'gvik-none' );
    }


    function resetArtist() {
      dom.empty( np );
      dom.empty( tracksCont );
      dom.empty( tagsCont );

      labelEl.innerText = '';
      imgEl.src = '';
      lastNameArtist = '';
      lastNameTrack = '';
      lastNameAlbum = '';
      cover.style.backgroundImage = 'none';

    }



    function lfapiCall( method, data, prop ) {

      var cacheId = trackId + method;

      if ( cache.has( cacheId ) ) {
        lastResult = cache.get( cacheId );
        return event.trigger( method, cache.get( cacheId ) );
      }


      lastfmAPI.call( method, data, function( res, isError ) {
        lastResult = res;

        tabCont.classList.add( 'loaded' );

        if ( isError )
          return event.trigger( method + '.error' );

        cache.set( cacheId, res[ prop ] );

        event.trigger( method, res[ prop ] );



      }, function() {
        event.trigger( method + '.error' );

      } );
    }

    function render( tmpl, arr, fn ) {
      var html = [],
        i = 0,
        l = arr.length;

      for ( ; i < l; i++ )
        html[ i ] = core.tmpl( tmpl, fn( arr[ i ] ) );


      return html.join( '' );
    }


    event
      .bind( '_newdata', function( data ) {

        trackId = data.trackId;

        if ( data.artist !== nameArtist ) {
          resetAlbum();
          resetArtist();
          lfapiCall( 'artist.getInfo', {
            artist: data.artist,
            correction: 1
          }, "artist" );

          lfapiCall( 'artist.getTopTracks', {
            artist: data.artist,
            correction: 1,
            limit: config.get( 'SIDEBAR_LASTFM_TOP_TRACKS_LIMIT' )
          }, "toptracks" );

          nameArtist = data.artist;
        }


        if ( nameTrack !== data.title ) {
          lfapiCall( 'track.getInfo', {
            artist: data.artist,
            track: data.title,
            correction: 1
          }, "track" );
          nameTrack = data.title;
        }

      } )

    .bind( 'track.getInfo', function( track ) {

      if ( !track.album ) return resetAlbum();

      if ( track.album.title === nameAlbum ) {
        albumTab.dispatchEvent( new Event( 'change' ) );
        albumTab.checked = true;
        return;
      }

      resetAlbum();

      nameAlbum = track.album.title;

      lfapiCall( 'album.getInfo', {
        artist: nameArtist,
        album: nameAlbum
      }, "album" );

    } )

    .bind( 'artist.getInfo', function( artist ) {


      nameArtist = artist.name;

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

    } )

    .bind( 'artist.getTopTracks', function( responseTracks ) {

      var html = '',
        track = responseTracks.track || [];


      if ( cnfg.get( 'lastfm-groupbyalbum' ) ) {
        var i = 0,
          groups = {},
          l = track.length;

        for ( ; i < l; i++ ) {
          if ( track[ i ].image ) {
            var img = track[ i ].image[ 1 ][ "#text" ];
            ( groups[ img ] = groups[ img ] || [] ).push( track[ i ] );
          } else
            ( groups.noimage = groups.noimage || [] ).push( track[ i ] );
        }

        for ( i in groups ) {
          if ( i !== "noimage" && groups.hasOwnProperty( i ) )
            html += render( TMPL.item, groups[ i ], TMPL.renderTrack );
        }

        html += render( TMPL.item, groups.noimage || [], TMPL.renderTrack );

        tracksCont.innerHTML = html;

      } else {
        html = render( TMPL.item, track || [], TMPL.renderTrack );
      }
      tracksCont.innerHTML = html;
    } )

    .bind( 'album.getInfo', function( album ) {

      var albName = [ album.name ];

      if ( album.releasedate ) {
        var res = album.releasedate.trim().match( /\d{4}/ );
        if ( res ) {
          albName.push( res[ 0 ] );
        }
      }

      albumTab.setAttribute( 'data-label', albName.join( ', ' ) );

      if ( album.tracks && album.tracks.track ) {
        var track = album.tracks.track;
      }

      if ( !track || !track.length ) {
        return dom.empty( albTracksCont );
      }

      albTracksCont.innerHTML = render( TMPL.item, track, TMPL.renderAlbumTrack.pbind( album ) );

      albumTab.dispatchEvent( new Event( 'change' ) );
      albumTab.checked = true;

      tabs.classList.remove( 'gvik-none' );

    } )

    .bind( 'newtrack', function( data ) {

      if ( !sidebar.shown ) {
        sidebar.show();
      }
      showCurTab();

      event.trigger( '_newdata', data );
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

        var _audioEl = dom.parent( el, '.gvikLastfm' );

        require( 'searchandplay' )( {
          artist: nameArtist,
          title: _audioEl.getAttribute( 'data-trackname' ),
          dur: _audioEl.getAttribute( 'data-duration' )
        }, function() {}, {
          maxbit: true
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