/**
 *
 *
 *
 *
 *
 */

_GViK( {
	'audio': [ 'download-enable', 'add-but' ],
}, function( gvik, require, Add ) {

	"use strict";

	var core = require( 'core' ),
		chrome = require( 'chrome' ),
		dom = require( 'dom' ),
		options = require( 'options' ),
		events = require( 'events' ),
		global = require( 'global' ),


		CONFS = options.get( 'audio' ),

		FROM_CACHE = CONFS.get( 'download-fromCache' ),
		SAVE_AS = CONFS.get( 'download-saveAs' ),

		rExtTest = /\.(?:\%e|mp3)$/,

		fileNamePattern = CONFS.get( 'format-filename' ),
		methodNameDownload = FROM_CACHE ? 'downloadFromCache' : 'download';


	function __formatFileName( data ) {

		fileNamePattern = fileNamePattern.trim();

		var ext = '.' + data.ext;


		if ( !rExtTest.test( fileNamePattern ) )
			fileNamePattern += ext;

		var fName = core.tmpl2( fileNamePattern, {
			a: data.artist,
			t: data.title,
			e: data.ext,
			d: data.dur,
			i: data.id
		} );

		fName = fName.replace(/[\\\/\:\*\?\"\<\>\|]+/gi, '').trim();

		if ( fName.length === ext.length )
			fName = data.artist + ' - ' + data.title + ext;

 

		return fName;
	}



	dom.setDelegate( document, '.audio:not([id=audio_global]):not([data-gvik-download])', 'mouseover', function( audioEl ) {

		audioEl.setAttribute( 'data-gvik-download', true );

		var infoEl = dom.byClass( 'info', audioEl ).item( 0 ),
			artistEl = dom.byTag( 'b', infoEl ).item( 0 ),

			titleEl = artistEl.nextElementSibling,

			data = global.VARS.PARSE_AUDIO_DATA( audioEl );

		data.artist = artistEl.innerText;
		data.title = titleEl.innerText;
		data.ext = "mp3";

		var butEl = dom.create( 'div', {
			append: dom.create( 'a', {
				append: document.createElement( 'div' )
			} ),

			prop: {
				'className': 'gvik-download'
			},

			events: {
				click: function( e ) {

					e.stopPropagation();
					e.preventDefault();

					e._canceled = true;

					chrome.download[ methodNameDownload ]( {
						url: data.url,
						filename: __formatFileName( data ),
						saveAs: SAVE_AS
					}, function( downloadItemId ) {
						chrome.download.search( downloadItemId, function( downloadItem ) {
							events.trigger( 'AUDIO_downloaded', {
								downloadItem: downloadItem,
								data: data
							} );
						} );
					} );
				}
			}
		} );

		data.act.appendChild( butEl );

		return data;

	} );
 

} );