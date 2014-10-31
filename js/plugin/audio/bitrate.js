/*
 
 
 
 
 */



_GViK.Init( function( gvik, require ) {

	var core = require( 'core' ),
		dom = require( 'dom' ),
		event = require( 'event' ),
		storage = require( 'storage' ),
		configs = require( 'configs' ),
		chrome = require( 'chrome' );


	var _cache = {};


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

		var input = audioEl.getElementsByTagName( 'input' ).item( 0 );

		if ( !input )
			return null;


		var parsedData = input.value.split( ',' );

		return {
			act: audioEl.getElementsByClassName( 'actions' ).item( 0 ),
			url: parsedData[ 0 ],
			dur: parsedData[ 1 ]
		};
	}


	var
		CONFS = configs.get( 'audio' ),

		FILE_SIZE_ENABLED = CONFS.get( 'file-size' ),
		LOADER_DISABLED = CONFS.get( 'loader-disable' ),
		CLASS_BITRATE = [ 'gvik-bitrate', ( LOADER_DISABLED ? '' : ' loader' ) ].join( '' ),
		NAME_ATTR = [ 'data-gvik-bitrate', ( FILE_SIZE_ENABLED ? '-filesize' : '' ) ].join( '' );


	function __getBitrate( url, dur, callback, needFileSize, id ) {

		if ( _cache[ id ] !== undefined ) {
			callback( _cache[ id ], true );
			return 'gvik-bitrate';
		}

		__getFilesSize( url, function( size ) {

			if ( !size )
				return callback( _cache[ id ] = {} );


			callback( _cache[ id ] = __calcBitrate( size, dur, needFileSize, id ) );

		} );

		return CLASS_BITRATE;

	}


	function setBitrate( audioEl ) {

		audioEl.setAttribute( NAME_ATTR, true );

		var data = __parseData( audioEl ),
			bitrateEl = document.createElement( 'div' );


		bitrateEl.className = __getBitrate( data.url, data.dur, function( res, fromCache ) {

			if ( fromCache ) {
				//
			} else {
				if ( !LOADER_DISABLED )
					bitrateEl.classList.remove( 'loader' );
			}

			bitrateEl.innerText = res.formated;
		}, FILE_SIZE_ENABLED, audioEl.id );

		data.act.appendChild( bitrateEl );
	}


	var AUDIO_SELECTOR = '.audio:not([id=audio_global]):not([' + NAME_ATTR + '])';


	function __sortTracks( tracks ) {
		return core.toArray( tracks ).sort( function( a, b ) {

		} );
	}

	function setBitrateAllAudios() {

		var audios = document.querySelectorAll( AUDIO_SELECTOR ),
			i = 0,
			l = audios.length - 1;

		if ( l < 0 )
			return;

		for ( ; i < l; i++ ) {
			setBitrate( audios[ i ] )
		}

		setBitrate( audios[ l ], function() {
			console.log( __sortTracks( audios ) );
		} );

	}


	event.bind( [
		'newAudioRows',
		'audio',
		'padOpen'
	], setBitrateAllAudios, true );


	dom.setDelegate( document, AUDIO_SELECTOR, 'mouseover', setBitrate );

} );