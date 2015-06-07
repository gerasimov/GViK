/*
 
 
 */



GViK( function( appData, require, Add ) {


	var core = require( 'core' ),
		constants = require( 'constants' ),
		global = require( 'global' ),
		events = require( 'events' ),
		vkapi = require( 'vkapi' );



	vkapi.pushPermission( 'message' );



	events.bind( 'message.load', function( data, evname, $scope ) {

		if ( !$scope.result )
			$scope.result = [];

		if ( !$scope.count )
			$scope.count = 1;


		if ( $scope.count <= $scope.result.length )
			return events.trigger( evname + '.clb', $scope.result );

		vkapi.call( 'messages.get', {
			count: 200,
			offset: $scope.result.length
		}, function( res ) {
			$scope.count = res.count;
			$scope.result.push.apply( $scope.result, res.items );

			events.asyncTrigger( evname, 0, 400 );

		} );

	} )

	.bind( 'message.load.clb', function( mes ) {

		var group = window.groupMess = {};


		core.each( mes, function( curMess ) {

			var uid = curMess.user_id;


			if ( !group[ uid ] ) {
				group[ uid ] = {

					count: 0,

					countIn: 0,
					countOut: 0,

					countCharIn: 0,
					countCharOut: 0

				};
			}


			if ( curMess.out ) {

				group[ uid ].countOut++;
				group[ uid ].countCharOut += curMess.body.length;

			} else {


				group[ uid ].countIn++;
				group[ uid ].countCharIn += curMess.body.length;
			}

			group[ uid ].count++;



		} );

		window.messHtml = core.map( mes, function( curMess ) {
			return core.tmpl( '<div><span><%=user_id></span><div><%=body></div></div>', curMess );
		} );

	} )
/*
	.trigger( 'message.load' );*/


} );