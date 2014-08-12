/**
 *
 *
 *
 */

GViKModule.Check( {}, [

	],

	function( gvik ) {

		function Launcher() {

			this.timerId;

			this.show = function() {
				gvik.dom.addClass( this.launcherLayer, 'show' );
				clearTimeout( this.timerId );
				this.timerId = setTimeout( function() {
					this.launcherInput.value = '';
					this.launcherInput.focus();
				}.bind( this ), 0 );
			};

			this.hide = function() {
				gvik.dom.removeClass( this.launcherLayer, 'show' );
				clearTimeout( this.timerId );
				this.timerId = setTimeout( function() {
					this.launcherInput.value = '';
					this.launcherInput.blur();
				}.bind( this ), 0 );
			};

			this.launcherInput = gvik.dom.create( 'input', {
				prop: {
					className: 'gvik-launcher-input mousetrap',
					type: 'text'
				},
				events: {
					click: function( e ) {
						e.stopPropagation();
					}
				}
			} );


			this.launcherInputCont = gvik.dom.create( 'div', {
				prop: {
					className: 'gvik-launcher-input-cont'
				},
				append: this.launcherInput
			} );


			this.launcherLayer = gvik.dom.create( 'div', {
				prop: {
					className: 'gvik-launcher-layer'
				},
				append: this.launcherInputCont,
				events: {
					click: this.hide.bind( this )
				}
			} );


			Mousetrap.bind( [ 'ctrl+`' ], function( e ) {
				gvik.dom.hasClass( this.launcherLayer, 'show' ) ? this.hide() : this.show();
				e.stopPropagation();
				e.preventDefault();

			}.bind( this ) );

			Mousetrap.bind( 'esc', this.hide.bind( this ) );


			this.trigger = function( name, data ) {
				gvik.event.trigger( name, data );
			};

			this.on = function( name, fn ) {
				gvik.event.on( 'LAUNCHER_enter', 0, fn.bind( this ) );
			}

			this.add = function( key, fn ) {
				Launcher.prototype[ key ] = fn;
			};
			this.on( 'LAUNCHER_enter', this.hide );

			this.launcherInput.onkeyup = function( e ) {
				if ( gvik.dom.hasClass( this.launcherLayer, 'gvik-hide' ) || event.keyCode != 13 ) {
					return;
				}

				var q = this.launcherInput.value.trim();


				if ( !q.length ) {
					return;
				}

				this.trigger( 'LAUNCHER_enter', q );

			}.bind( this );

			gvik.dom.appendBody( this.launcherLayer );

		}

		GViKModule.Add( 'launcher', new Launcher );

	} );