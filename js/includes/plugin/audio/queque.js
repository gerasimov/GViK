/*
 
 
 
 
 */

GViK( function( appData, require, Add ) {

	var events = require( 'events' ),
		dom = require( 'dom' ),
		global = require( 'global' ),
		core = require( 'core' ),
		sidebar = require( 'sidebar' ),

		playlist = [],
		disableTracks = [],

		tempCont = {},

		render = {
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
		},

		page = sidebar.addPage();


	function drawSidebar() {
		page.tabCont.innerHTML = '<ul>' + core.map( playlist, function( id, i ) {

			var track = window.audioPlayer.songInfos[ id ];


			return core.template( render.TMPL, /\{\{\w+\}\}/gi, [ 2, -2 ], {
				artist: track[ 5 ],
				title: track[ 6 ],
				index: ( i + 1 ) + '. '
			} );

		} ).join( '' ) + '</ul>';

		page.show();
		sidebar.show();
	}

	events.bind( 'playerOpen', function( data, evename, $scope ) {
 
		core.decorator( 'audioPlayer.operate', function( a ) {

			if ( $scope.lastId === a[ 0 ] )
				return;

			if ( disableTracks.indexOf( a[ 0 ] ) >= 0 ) {

				a.__disabled = true;
				return a;
			}

			if ( !playlist.length )
				return;


			a[ 0 ] = playlist.shift();

			drawSidebar();

			return a;
		}, true );

	} )

	.bind( 'audio.globalStart', function() {
		if ( !core.isEmpty( tempCont ) ) {
			core.extend( window.audioPlayer.songInfos, tempCont );
		}
	} )


	.bind( 'audio.addQueque', function( el ) {

		var id = global.VARS.CLEAN_ID( el.id );

		if ( window.audioPlayer ) {
			window.audioPlayer.songInfos[ id ] = global.VARS.PARSE_AUDIO( el );
		} else {
			tempCont[ id ] = global.VARS.PARSE_AUDIO( el );
		}

		playlist.push( id );

		drawSidebar();
	} )

	.bind( 'audio.disableTrack', function( el ) {


		var id = global.VARS.CLEAN_ID( el.id );

		if ( disableTracks.indexOf( id ) == -1 ) {
			disableTracks.push( id );

			dom.addClass( el, 'disable' );
			dom.addClass( dom.byClass( 'area', el ).item( 0 ), 'deleted' );

		}

	} );



	dom.addClass( page.tabCont, 'loaded' );

	require( 'ContextMenu' )( '.audio' )
		.init()
		.addItem( [ {
				label: 'Добавить в очередь',
				clb: function( el ) {
					events.trigger( 'audio.addQueque', el );
				}
			},

			{
				label: 'Не воспроизводить',
				clb: function( el ) {
					events.trigger( 'audio.disableTrack', el );
				}
			}
		] );


} );