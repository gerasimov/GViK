/*
 
 
 
 
 
 */



_GViK( function( appData, require, Add ) {


	var core = require( 'core' ),
		vkapi = require( 'vkapi' ),
		dom = require( 'dom' ),
		event = require( 'event' );



	vkapi.pushPermission( 'messages' );



	vkapi.call( 'messages.get', {}, function( res ) {
		console.log( res );
	} );


	//Add('');

} );