/**
 *
 *
 *
 */

if ( typeof _GViK === 'undefined' )( function( win ) {

        "use strict";

        var superUniqKey = Date.now() + Math.random();

        win[ superUniqKey ] = {};


        win.getID = function() {
            return win.__ID;
        };

        win._GViK = {
            Init: function() {
            [].slice.call( arguments )
                    .forEach( function( _ ) {
                        if ( typeof _ === 'function' )
                            _.call( win, win, function( module ) {
                                return win[ superUniqKey ][ module ];
                            } );
                    } );
            },

            _Get: function() {
                return win[ superUniqKey ];
            },

            Add: function( key, fn ) {

                var _add = function( name, fn ) {
                    win[ superUniqKey ][ name ] = ( typeof fn === 'function' ) ?
                        fn.call( win, win ) :
                        fn;
                };

                var i, carr;

                switch ( arguments.length ) {
                    case 1:

                        if ( Array.isArray( key ) ) {
                            if ( Array.isArray( key[ 0 ] ) ) {
                                for ( i = 0; i < key.length; i++ ) {
                                    carr = key[ i ];
                                    carr.push( true );

                                    this.Add.apply( this, carr );
                                }
                            } else {
                                key.push( true );
                                this.Add.apply( this, key );
                            }
                        } else
                            for ( i in key )
                                _add( i, key[ i ] );
                        break;
                    case 2:
                        _add( key, fn );
                        break;
                    default:
                        break;
                }
            }
        };

    } )
    .call( window, window );