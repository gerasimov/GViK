/*
 
 
 
 
 */

GViK( {}, [ 'sidebar' ], function( appData, require, Add ) {

  var events = require( 'events' );
  var dom = require( 'dom' );
  var helpers = require( 'helpers' );
  var core = require( 'core' );
  var sidebar = require( 'sidebar' );

  var playlist = [];
  var tempCont = {};

  var render = {
    TMPL: '<li>\
            <div>\
              <div>\
                <span>{{index}}</span>\
                <a>{{artist}}</a>\
                <span> - {{title}}</span>\
              </div>\
              <div></div>\
            </div>\
          </li>'
  };

  var contextMenu = require( 'ContextMenu' )( '.audio' ).init();

  var sidebarPage = sidebar.addPage().hideLoading();

  events
    .bind( 'playerOpen', function( data, evename, $scope ) {
      core.decorator( 'audioPlayer.operate', function( a ) {

        var audioId = a[ 0 ];
        var isNxt = a[ 1 ];

        if ( isNxt === undefined && playlist.length ) {
          a = [ playlist.shift() ];
        }

        return a;
      }, true );
    } )
    .bind( 'audio.globalStart', function() {
      if ( !core.isEmpty( tempCont ) ) {
        core.extend( window.audioPlayer.songInfos, tempCont );
      }
    } );


  contextMenu.addItem( {
    label: 'Добавить в очередь',
    clb: function( el ) {
      var id = helpers.CLEAN_ID( el.id );

      if ( window.audioPlayer ) {
        window.audioPlayer.songInfos[ id ] = helpers.PARSE_AUDIO( el );
      } else {
        tempCont[ id ] = helpers.PARSE_AUDIO( el );
      }

      playlist.push( id );

      sidebarPage.setHtml( core.map( playlist, function( audioId, i ) {
        var audioData = window.audioPlayer.songInfos[ audioId ] || tempCont[ audioId ];

        return core.template( render.TMPL, /\{\{\w+\}\}/g, [ 2, -2 ], {
          index: 1 + i,
          artist: audioData[ 5 ],
          title: audioData[ 6 ]
        } );
      } ).join( '' ) );
    }
  } );


} );