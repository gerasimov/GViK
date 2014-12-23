/**
 *
 *
 *
 *
 */


_GViK.Init( {},

	[
		'launcher'
	],

	function( gvik ) {

		var rp = /^([\w\s]+)\:(.*)?$/i,

			_arg,

			commands = {

			},

			search = function( name ) {

				name = name.trim().toLowerCase();


				var l = name.length,
					z = 0,

					minL = Math.max( Math.floor( l / 2 ), 4 ),

					i,
					cname,
					cdata,
					count,

					res = [],
					r;



				for ( i in commands ) {

					cdata = commands[ i ];

					cname = cdata[ 1 ].toLowerCase().replace( /\s+/g, '' );
					count = 0;

					r = '';

					for ( z = 0; z <= l; z++ ) {

						if ( cname.indexOf( name[ z ] ) !== -1 && r.indexOf( name[ z ] ) < 0 ) {
							count++;
							r += name[ z ];
						}

						if ( count >= minL ) {
							res.push( cdata );
							break;
						}

					}
				}

				return res;
			},

			refreshCommandList = function( data ) {
				var data = search( data.command );

				if ( data.length ) {
					console.log( data[ 0 ][ 1 ], data[ 0 ][ 0 ] )
				}
			},

			callCommand = function() {
				if ( commands[ _arg.command ] ) {
					commands[ _arg.command ][ 0 ]( _arg.arg, _arg.str );
				}
			},


			parse = function( str ) {

				var data = str.match( rp );

				if ( !data ) {
					return null;
				}

				return {
					command: ( data[ 1 ] || '' ).trim(),
					arg: ( data[ 2 ] || '' ).trim(),
					str: str
				}
			},

			enterData = function( str ) {
				_arg = parse( str ) || {
					command: 'defaultCommand',
					arg: str,
					str: str
				};


				refreshCommandList( _arg );
			};

		gvik.launcher.add( 'command', {
			add: function( key, fn, desc ) {
				commands[ key ] = [ fn, desc ];
			}
		} );

		gvik.dom.setEvent( gvik.launcher.input, 'keyup', function( e ) {
			if ( e.keyCode !== 13 ) {
				enterData( this.value );
			}
		} );

		gvik.launcher.on( 'LAUNCHER_enter', function( q ) {
			callCommand( _arg );
		} );

	} );