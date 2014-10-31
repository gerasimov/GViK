/**





*/


_GViK.Init( function( gvik, require ) {

	var core = require( 'core' ),
		_chrome = require( 'chrome' ),
		configs = require( 'configs' ),
		dom = require( 'dom' );


	var tab = dom.byId( 'tab' ),
		tabs = core.toArray( dom.queryAll( '.tabs > ul li', tab ) ),
		tabsCont = core.toArray( dom.queryAll( '.tabs-cont > div', tab ) ),
		lastID = 0;

	dom.setData( tabsCont[ lastID ], 'id', lastID );

	function classManip( i, key, className ) {

		var ctab = tabs[ i ],
			ctabcont = tabsCont[ i ];


		if ( !ctab || !ctabcont )
			return;

		ctab.classList[ key ]( className );
		ctabcont.classList[ key ]( className );
	}


	function addEvent( el, ID ) {
		dom.setEvent( el, 'click', function() {
			if ( lastID === ID )
				return;

			classManip( lastID, 'remove', 'active' );
			classManip( ID, 'add', 'active' );

			lastID = ID;
		} );

		dom.setData( tabs[ ID ], 'id', ID );
	}

	core.each( tabs, addEvent );

	classManip( 0, 'add', 'active' );



	dom.setDelegate( document, '.dropdown', {
		mouseout: function( el, e ) {

			var trg = e.relatedTarget;

			if ( dom.is( trg, '.dropdown' ) ||
				dom.parent( trg, '.dropdown' ) )
				return;

			el.classList.remove( 'active' );

		},

		mousedown: function() {
			this.classList.toggle( 'active' )
		}
	} );




} );