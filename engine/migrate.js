/**
 *
 *
 *
 */

if ( typeof GViKModule === 'undefined' ) {
	window.GViKModule = {
		Check: function( f, s, initFn ) {
			initFn.call( window, window );
		},

		Add: function() {

		}
	};
}