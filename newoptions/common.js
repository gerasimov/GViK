/*



 */


_GViK.Init( function( gvik, require ) {

	var storage = require( 'storage' ),
		event = require( 'event' ),
		core = require( 'core' ),
		dom = require( 'dom' ),
		lastfmAPI = require( 'lastfmAPI' ),
		configs = require( 'configs' ),
		vkapi = require( 'vkapi' ),
		_chrome = require( 'chrome' );


	gvik.getID = function() {
		return window.id;
	}

	function showMessage( msg ) {
		dom.byId( 'content' ).innerHTML = core.tmpl( '<div class="message <%=type>"><div class="message-title"><%=text></div></div>', msg );
	}

	event

	.bind( [ 'id_error', 'id_notlogin' ], showMessage )

	.bind( 'id_loaded', function( ID ) {

		vkapi.call( 'users.get', {
			fields: 'photo'
		}, function( s ) {
			dom.query( '.vk_id' ).innerHTML = core.tmpl( '<img src="<%=photo>"><%=first_name> <%=last_name>', s[ 0 ] );
		} );
	} )

	.bind( 'id_loaded', function( ID ) {
		_chrome.local.get( {
			key: 'options'
		}, function( s ) {
			if ( !core.isPlainObject( s.options ) || core.isEmpty( s.options ) ) {
				chrome.storage.local.get( 'options', function( o ) {
					configs.load( o.options );
					event.trigger( 'optionsLoaded', o.options );
				} )
			} else {
				configs.load( s.options );
				event.trigger( 'optionsLoaded', s.options );
			}
		} );
	} )

	.bind( 'id_loaded', function( ID ) {
		_chrome.sync.get( {
			key: 'lastfm'
		}, function( s ) {

			if ( core.isEmpty( s.lastfm ) ) {
				return;

			}

			console.log( s )
			lastfmAPI.call( 'user.getInfo', {
				user: s.lastfm.name
			}, function( res ) {
				dom.query( '.lastfm_username' ).innerHTML =  '<img src="'+res.user.image[1]['#text']+'">' + res.user.name;
			} )

		} );
	} )

	function checkID( res ) {

		if ( res === 404 ) {

			event.trigger( 'id_error', {
				text: 'ERROR SERVER VK',
				type: 'red'
			} );

		} else {
			window.id = res.user.id || null;


			if ( !getID() ) {
				event.trigger( 'id_error', {
					text: 'ERROR',
					type: 'red'
				} );
			} else if ( getID() > 0 ) {
				event.trigger( 'id_loaded' );
			} else {
				event.trigger( 'id_notlogin', {
					text: 'NOT LOGIN',
					type: 'yellow'
				} );
			}
		}


		dom.byId( 'content' ).classList.add( 'loaded' );
	}

	core.ajax( {
		url: 'https://vk.com/feed2.php',
		type: 'GET',
		dataType: 'json'
	}, checkID, checkID );


} );