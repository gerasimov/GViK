/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK.Init( {
    'sidebar': 'lastfm-module'
  }, [
        'lastfm',
        'sidebar'
    ],
  function( gvik, require ) {


    "use strict";

    var

      core = require( 'core' ),
      dom = require( 'dom' ),
      event = require( 'event' ),
      lastfmAPI = require( 'lastfmAPI' ),
      launcher = require( 'launcher' ),
      options = require( 'options' ),
      sidebar = require( 'sidebar' ),


      nameArtist,
      nameTrack,
      nameAlbum,
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

      cnfg = options.get( 'sidebar' );



    function lfapiCall( method, data, callback, error ) {

      lastfmAPI.call( method, data, function( res, isError ) {
        lastResult = res;
        return typeof callback === 'function' && callback.apply( this, arguments )
      }, function() {
        return error && error.apply( this, arguments );
      } );
    }


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
                </span>'
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

    function secToTime( sec ) {
      var result = [],

        hours = ( '00' + ( ( sec / 3600 % 3600 ) | 0 ) )
        .slice( -2 ),
        mins = ( '00' + ( ( ( sec / 60 ) % 60 ) | 0 ) )
        .slice( -2 ),
        secs = ( '00' + ( sec % 60 ) )
        .slice( -2 );

      if ( hours !== '00' ) {
        result.push( hours );
      }
      result.push( mins );
      result.push( secs );

      return result.join( ':' );
    }

    function getArtistInfo( callback, error ) {

      lfapiCall( 'artist.getInfo', {
        artist: nameArtist,
        correction: 1
      }, function( response ) {
        var responseArtist = response.artist;
        nameArtist = responseArtist.name;
        if ( typeof callback === 'function' ) {
          callback.call( this, responseArtist );
        }

        event.trigger( 'SIDEBAR_LASTFM_artistinfoload', responseArtist );

      }, error );
    }

    function getTrackInfo( callback, error ) {
      lfapiCall( 'track.getInfo', {
        artist: nameArtist,
        track: nameTrack,
        correction: 1
      }, function( response ) {
        var responseTrack = response.track;

        nameTrack = responseTrack.name;

        if ( responseTrack.album ) {
          nameAlbum = responseTrack.album.title;
        }

        if ( typeof callback === 'function' ) {
          callback.call( this, responseTrack );
        }

        event.trigger( 'SIDEBAR_LASTFM_trackinfoload', responseTrack );
      } );
    }


    function getAlbumInfo( callback, error ) {
      lfapiCall( 'album.getInfo', {
        artist: nameArtist,
        album: nameAlbum
      }, function( response ) {

        if ( typeof callback === 'function' ) {
          callback.call( this, response.album );
        }

        event.trigger( 'SIDEBAR_LASTFM_albumload', response.album );
      }, resetAlbum );
    }

    function getTracks( callback, error ) {
      lfapiCall( 'artist.getTopTracks', {
        artist: nameArtist,
        correction: 1,
        limit: 150
      }, function( response ) {
        if ( typeof callback === 'function' ) {
          callback.call( this, response.toptracks );
        }
        event.trigger( 'SIDEBAR_LASTFM_toptracksload', response.toptracks );
      }, function() {
        dom.empty( tracksCont );
      } );
    }


    function render( tmpl, arr, fn ) {
      var html = '',
        i = 0,
        l = arr.length;

      for ( ; i < l; i++ ) html += core.tmpl( tmpl, fn( arr[ i ] ) );

      return html;
    }


    event
      .bind( 'SIDEBAR_LASTFM_newartist', getArtistInfo )
      .bind( 'SIDEBAR_LASTFM_newartist', getTracks )
      .bind( 'SIDEBAR_LASTFM_load', getTrackInfo )

    .bind( 'SIDEBAR_LASTFM_trackinfoload', function( track ) {
      if ( track.album ) {
        getAlbumInfo();
      } else {
        resetAlbum();
      }
    } )

    .bind( 'SIDEBAR_LASTFM_artistinfoload', function( artist ) {

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
      } ), function( curTag ) {
        return {
          url: curTag.url,
          tag: curTag.name
        };
      } );

    } )

    .bind( 'SIDEBAR_LASTFM_toptracksload', function( responseTracks ) {
      tracksCont.innerHTML = render( TMPL.item, responseTracks.track || [], function( curTrack ) {
        return {
          url: curTrack.url,
          name: curTrack.name,
          dur: secToTime( curTrack.duration ),
          duration: curTrack.duration,
          img: ( curTrack.image ? curTrack.image[ 1 ][ '#text' ] : ( gvik.APP_PATH + 'img/album.png' ) /*responseArtist.image[ 1 ][ '#text' ]*/ )
        };
      } );
    } )

    .bind( 'SIDEBAR_LASTFM_albumload', function( album ) {

      if ( !album.name ) {
        return resetAlbum();
      }

      var albName = [ album.name ];

      if ( album.releasedate ) {
        var res = album.releasedate.trim()
          .match( /\d{4}/ );
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

      albTracksCont.innerHTML = render( TMPL.item, track, function( curTrack ) {
        return {
          url: curTrack.url,
          name: curTrack.name,
          duration: curTrack.duration,
          dur: secToTime( curTrack.duration ),
          img: album.image[ 1 ][ '#text' ]
        };
      } );

      albumTab.dispatchEvent( new Event( 'change' ) );
      albumTab.checked = true;

      tabs.classList.remove( 'gvik-none' );

    } )

    .bind( 'newtrack', function( data ) {

      nameArtist = data.artist;
      nameTrack = data.title;


      var cart = data.artist.toLowerCase()
        .split( /\s+/g )
        .join( '' ),
        ctit = data.title.toLowerCase()
        .split( /\s+/g )
        .join( '' );

      if ( cart !== lastNameArtist ) {
        resetAlbum();
        resetArtist();
        event.trigger( 'SIDEBAR_LASTFM_newartist', data );
      }

      if ( ctit !== lastNameTrack ) {
        event.trigger( 'SIDEBAR_LASTFM_newtrack', data );

      }

      lastNameArtist = cart;
      lastNameTrack = ctit;

      event.trigger( 'SIDEBAR_LASTFM_load', data );

    } );

    sidebar.addPage( function( _switcher, _tabCont, _wrap, countPage ) {

      // _switcher.classList.add('icon-lastfm');
      _tabCont.classList.add( 'loaded' );

      wrap = _wrap;
      tabCont = _tabCont;

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