GViK( function( appData, require, Add ) {

	var core = require( 'core' );

	
	core.define( [

			'engine/constants.js',

			'engine/core/cache.js',
			'engine/core/events.js',
			'engine/core/storage.js',


			'engine/core/dom.js',

			'engine/api/chrome.js',
			'engine/api/support.js',
			'engine/api/methods.js',


			'engine/api/port/content.js',
			'engine/options.js'


		], {
			path: '/js/'
		},

		function() {
			var events = require( 'events' ), constants = require( 'constants' );

			events.bind( 'init', function() {
				core.define( [
					'/js/includes/plugin/vkapi/vkapi.js',
					'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
					'https://cdnjs.cloudflare.com/ajax/libs/jplayer/2.9.2/jplayer/jquery.jplayer.min.js',
					'js/main.js'
				] );
			} );


			if ( localStorage.curId == null )
				core.ajax( {
					'type': 'GET',
					'dataType': 'json',
					'url': 'https://vk.com/feed2.php?act=user'
				}, function( res ) {
					constants.define( 'ID', res.user.id );
					events.asyncTrigger( 'init' );
				} );
			else {
				constants.define( 'ID', localStorage.curId );
				events.asyncTrigger( 'init' );
			}



		} );


} );