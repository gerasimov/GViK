/**
 *
 *
 *
 *
 *
 */

_GViK.Init( function( gvik, require ) {

	"use strict";

	var core = require( 'core' ),
		chrome = require( 'chrome' ),
		dom = require( 'dom' ),
		event = require( 'event' ),

		CONFS = gvik.configs.get( 'audio' ),

		FROM_CACHE = CONFS.get( 'download-fromCache' ),
		SAVE_AS = CONFS.get( 'download-saveAs' );



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



	function __setDownloadButton( audioEl  ) {

		audioEl.setAttribute( 'data-gvik-download', true );

		var data = __parseData( audioEl );

		if ( data == null ) {
			return;
		};

		var infoEl = audioEl.getElementsByClassName( 'info' ).item( 0 ),
			artistEl = infoEl.getElementsByTagName( 'b' ).item( 0 ),
			titleEl = artistEl.nextElementSibling,
			fileName = artistEl.innerText + ' - ' + titleEl.innerText + '.mp3',


			butEl = dom.create( 'div', {
				append: dom.create( 'a', {
					append: document.createElement( 'div' )
				} ),

				prop: {
					'className': 'gvik-download'
				},

				events: {
					click: function( e ) {

						e.stopPropagation();

						chrome.download[ FROM_CACHE ? 'downloadFromCache' : 'download' ]( {
							url: data.url,
							filename: fileName,
							saveAs: SAVE_AS
						} );
					}
				}
			} );

		data.act.appendChild( butEl );

		return data;

	}

	dom.setDelegate( document, '.audio:not([id=audio_global]):not([data-gvik-download])', 'mouseover', __setDownloadButton);

} );