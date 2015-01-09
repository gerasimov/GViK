/*
 
 
 
 
 
 */



_GViK( function( appData, require ) {

	var dom = require( 'dom' ),
		core = require( 'core' ),

		contextmenuItemContEl,

		contextmenuEl = dom.create( 'div', {
			attr: {
				'class': 'gvik-contextmenu'
			},
  
			events: {

				mouseleave: function() {
					this.style.display = 'none';
				},

				contextmenu: function( e ) {

					e.stopPropagation();
					e.preventDefault();

					e._canceled = true;
				}

			},

			append: [
				( contextmenuItemContEl = dom.create( 'ul' ) )
			]
		} );

	dom.append( document.body, contextmenuEl );

	contextmenuItemContEl.innerHTML = core.map(
		[ "Копировать название",
			"Копировать исполнителя",
			"Скачать"
		],
		function( lbl ) {
 	
			return '<li><a href="#">' + lbl + '</a></li>';
		} ).join( '' );


	dom.setDelegate( document, {
		'.audio': {
			contextmenu: function( el, e ) {
 

				e.stopPropagation();
				e.preventDefault();

				e._canceled = true;

				dom.setStyle( contextmenuEl, {
					left: ( e.pageX - 10 ) + 'px',
					top: ( e.pageY - 10 ) + 'px',
					display: 'block'
				} );

			}
		}
	} );

} );