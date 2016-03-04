/*
 
 
 */


GViK( function( appData, require, add ) {


	var core = require( 'core' );
	var events = require( 'events' );
	var storage = require( 'storage' );
	var cache = require( 'cache' );
	var chrome = require( 'chrome' );



	function InstagramApi() {
		this.CLIENT_ID = 'c67650e5149c4d3ea775ec720ced5c29';
		this.CLIENT_SECRET = 'ca2dcbf9bf184f0da1d64db1499024b2';
		this.ROOT_URL = '';

		this.AUTH_URL = 'https://api.instagram.com/oauth/authorize/?' + core.map( {
				client_id: this.CLIENT_ID,
				redirect_uri: 'http://vk.com/',
				response_type: 'token'
			}, function( v, k ) {
				return k + '=' + v;
			} )
			.join( '&' );


		chrome.sync.get( {
			key: 'instagram'
		}, function( data ) {
			console.log( data );
		} );

	};

	InstagramApi.prototype.call = function() {


		var data = {

		};

		chrome.ajax( {
			url: this.ROOT_URL,
			data: data
		}, function() {


		} );

	};

	InstagramApi.prototype.showAuthWindow = function() {

		var width = parseInt( screen.width / 2 );
		var height = parseInt( screen.height / 2 );

		chrome.sendRequest( 'auth', {
			data: {
				url: this.AUTH_URL,

				width: width,
				height: height,
				top: parseInt( height / 3 ),
				left: parseInt( width / 2 )
			},
			callback: function( token ) {

				chrome.sync.set( {
					instagram: {
						token: token
					}
				} );

				storage.local.set( 'instagram', {
					token: token
				} );

			}.bind( this ),
			error: function() {
				console.log( arguments );
			}.bind( this )
		} );
	};


	InstagramApi.prototype.auth = function() {



	};


	add( 'instagramApi', new InstagramApi );


} );