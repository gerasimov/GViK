_GViK.Init( function( gvik, require ) {

	require( 'core' ).define( [
		'/engine/dom.js',
		'/engine/events.js',


		'/engine/configs.js',
		'/engine/storage.js',
		'/engine/api/support.js',
		'/engine/api/methods.js',
		'/engine/api/port.content.js',
		'/engine/api/chrome.js',
		'/js/lib/md5.js',
		'/js/plugin/vkapi/vkapi.js',
		'/js/plugin/lastfm/api.js',

		'ui.js',
		'common.js'
	] );
} );