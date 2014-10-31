/**
 *
 *
 *
 */

_GViK.Init( function( gvik, require ) {


	var core = require( 'core' ),
		event = require( 'event' ),
		dom = require( 'dom' );



	function Launcher() {

		this.timerId;

		this.show = function() {
			dom.addClass( this.layer, 'show' );
			clearTimeout( this.timerId );
			this.timerId = setTimeout( function() {
				this.input.value = '';
				this.input.focus();
			}.bind( this ), 0 );
		};

		this.hide = function() {
			dom.removeClass( this.layer, 'show' );
			clearTimeout( this.timerId );
			this.timerId = setTimeout( function() {
				this.input.value = '';
				this.input.blur();
			}.bind( this ), 0 );
		};

		this.input = dom.create( 'input', {
			prop: {
				className: 'gvik-launcher-input mousetrap',
				type: 'text'
			}
		} );


		this.resultCont = dom.create( 'div', {
			prop: {
				className: 'gvik-launcher-result'
			}
		} );

		this.inputCont = dom.create( 'div', {
			prop: {
				className: 'gvik-launcher-input-cont'
			},
			events: {
				click: function( e ) {
					e.stopPropagation();
				}
			},
			append: [ this.input, this.resultCont ]
		} );


		this.layer = dom.create( 'div', {
			prop: {
				className: 'gvik-launcher-layer'
			},
			append: this.inputCont,
			events: {
				click: this.hide.bind( this )
			}
		} );


		gvik.Mousetrap.bind( [ 'ctrl+`' ], function( e ) {
			dom.hasClass( this.layer, 'show' ) ? this.hide() : this.show();
			e.stopPropagation();
			e.preventDefault();
		}.bind( this ) );

		gvik.Mousetrap.bind( 'esc', function( e ) {
			this.hide();
			e.stopPropagation();
			e.preventDefault();
		}.bind( this ) );


		this.trigger = function( name, data ) {
			event.trigger( name, data );
		};

		this.on = function( name, fn ) {
			event.bind( 'LAUNCHER_enter', fn.bind( this ) );
		}

		this.add = function( key, data ) {
			Launcher.prototype[ key ] = data;
		};

		this.on( 'LAUNCHER_enter', this.hide );

		dom.setEvent( this.input, 'keyup', function( e ) {

			if ( !dom.hasClass( this.layer, 'show' ) || e.keyCode != 13 ) {
				return;
			}

			var q = this.input.value.trim();

			if ( !q.length ) {
				return;
			}

			this.trigger( 'LAUNCHER_enter', q );

		}.bind( this ) );

		dom.append( document.body, this.layer );

	}

	_GViK.Add( 'launcher', new Launcher );

} );