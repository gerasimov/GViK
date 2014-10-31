/**
 *
 *
 *
 */

if ( typeof _GViK === 'undefined' )( function( win ) {

	var superUniqKey = Date.now() + Math.random();

	win[ superUniqKey ] = {};

	win._GViK = {
		Init: function() {
			[].slice.call( arguments ).forEach( function( _ ) {
				if ( typeof _ === 'function' ) _.call( win, win, function( module ) {
					return win[ superUniqKey ][ module ];
				} );
			} );
		},

		Add: function( key, fn ) {

			var _add = function( name, fn ) {
				win[ superUniqKey ][ name ] = ( typeof fn === 'function' ) ?
					fn.call( win, win ) :
					fn;
			};


			switch ( arguments.length ) {
				case 1:
					for ( var i in key ) _add( i, key[ i ] );
					break;
				case 2:
					_add( key, fn );
					break;
				default:
					break;
			}
		}
	};

} ).call( window, window );