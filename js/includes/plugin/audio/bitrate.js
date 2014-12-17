/*




 */



_GViK.Init( {
		'audio': [ 'download-enable', 'add-bit' ]

	},
	function( gvik, require ) {

		"use strict";

		var core = require( 'core' ),
			dom = require( 'dom' ),
			event = require( 'event' ),
			storage = require( 'storage' ),
			configs = require( 'configs' ),
			chrome = require( 'chrome' );


		function __getFilesSize( url, callback ) {

			chrome.simpleAjax( {
					type: 'HEAD',
					url: url,
					getheader: 'Content-Length'
				}, function( contentLenght ) {
					callback( contentLenght );
				},
				function() {
					callback( 0 );
				} );

		}


		function __calcBitrate( size, dur, needFileSize ) {
			var bitInt = ( ( size * 8 ) / dur / 1000 ) | 0,
				fileSizeInt = 0,
				formated = bitInt + 'kbps';

			if ( needFileSize ) {
				fileSizeInt = ( ( size / ( 1024 * 1024 ) ) | 0 );

				formated += ', ' + fileSizeInt + 'MB';

			}

			return {
				formated: formated,
				bitInt: bitInt,
				size: size,
				fileSizeInt: fileSizeInt
			};
		}



		function __parseData( audioEl ) {

			var input = audioEl.getElementsByTagName( 'input' )
				.item( 0 );

			if ( !input )
				return null;


			var parsedData = input.value.split( ',' );

			return {
				act: audioEl.getElementsByClassName( 'actions' )
					.item( 0 ),
				url: parsedData[ 0 ],
				dur: parsedData[ 1 ]
			};
		}

		storage.VARS.PARSE_DATA = __parseData;


		var
			CONFS = configs.get( 'audio' ),

			FILE_SIZE_ENABLED = CONFS.get( 'file-size' ),
			LOADER_DISABLED = CONFS.get( 'loader-disable' ),
			CLASS_BITRATE = [ 'gvik-bitrate', ( LOADER_DISABLED ? '' : ' loader' ) ].join( '' ),
			NAME_ATTR = [ 'data-gvik-bitrate', ( FILE_SIZE_ENABLED ? '-filesize' : '' ) ].join( '' );


		function __getBitrate( url, dur, callback, needFileSize, id ) {

			var cache;

			if ( ( cache = storage.VARS[ id ] ) ) {
				callback( cache, true );
				return 'gvik-bitrate';
			}

			__getFilesSize( url, function( size ) {

				if ( size ) {
					callback( __calcBitrate( size, dur, needFileSize, id ) );
					return;
				}
			} );

			return CLASS_BITRATE;
		}

		var tId;


		function setBitrate( audioEl, callback ) {

			audioEl.setAttribute( NAME_ATTR, true );

			var data = __parseData( audioEl ),
				bitrateEl = document.createElement( 'div' ),
				id = audioEl.id;


			bitrateEl.className = __getBitrate( data.url, data.dur, function( res, fromCache ) {

				if ( fromCache ) {
					//
				} else {
					if ( !LOADER_DISABLED )
						bitrateEl.classList.remove( 'loader' );
				}

				bitrateEl.innerText = res.formated;

				storage.VARS[ id ] = res;

				if ( typeof callback === 'function' )
					callback( bitrateEl, res, audioEl );
			}, FILE_SIZE_ENABLED, id );

			data.act.appendChild( bitrateEl );
		}


		var AUDIO_SELECTOR = '.audio:not([id=audio_global]):not([' + NAME_ATTR + '])';



		var clbck = CONFS.get( 'auto-load-bit' ) ? function( bitrateEl, res, audioEl ) {
			if ( window.cur && window.cur.searchStr ) {
				clearTimeout( tId );

				tId = setTimeout( function() {
					event.trigger( 'bitrate_load' );
				}, 20 );
			}
		} : null;


		function setBitrateAllAudios() {

			var audios = document.querySelectorAll( AUDIO_SELECTOR ),
				i = 0,
				l = audios.length;


			for ( ; i < l; i++ ) setBitrate( audios[ i ], clbck );
		}



		function getCacheInt( id ) {
			var cache = storage.VARS[ id ];
			return cache ? cache.bitInt : 0;
		}



		event.bind( 'bitrate_load', function() {

			var searchList = window.cur.sContent || dom.byId( 'search_list' ),
				audios = dom.queryAll( '.audio[' + NAME_ATTR + ']', searchList );

			if ( !audios.length )
				return;

			audios = core.toArray( audios )
				.sort( function( a, b ) {
					return getCacheInt( b.id ) - getCacheInt( a.id );
				} );


			var df = document.createDocumentFragment();

			for ( var i = 0; i < audios.length; i++ ) {
				df.appendChild( audios[ i ] );
			}

			event.trigger( 'audio_sort', audios );

			searchList.appendChild( df );
		} );

		if ( CONFS.get( 'auto-hide-bit' ) )
			event.bind( 'audio_sort', function( audios ) {
				for ( var i = audios.length; i--; ) {
					if ( getCacheInt( audios[ i ].id ) < 260 )
						audios[ i ].style.display = "none";
					else {
						break;
					}
				}
			} );


		event.bind( [
		'newAudioRows',
		'audio',
		'padOpen'
	], setBitrateAllAudios, true );


		dom.setDelegate(
			document,
			AUDIO_SELECTOR, {
				'mouseover': setBitrate
			} );

	} );