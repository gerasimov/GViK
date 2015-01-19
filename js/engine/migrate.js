/**
 *
 *
 *
 */

if ( typeof _GViK === 'undefined' )( function( win ) {

        "use strict";

        var _modules = {},

            _add = function( name, fn, nocallfn ) {

                name = name.toLowerCase();

                _modules[ name ] = ( typeof fn === 'function' && !nocallfn ) ?
                    fn.call( win, win ) :
                    fn;
            };


        function Add( key, fn, nocallfn ) {


            var i, carr;

            switch ( arguments.length ) {
                case 1:
                    for ( i in key )
                        _add( i, key[ i ], fn );
                    break;
                case 2:
                    _add( key, fn, nocallfn );
                    break;
                default:
                    break;
            }
        }

        function _GViK() {
            [].forEach.call( arguments, function( fn ) {
                if ( typeof fn === 'function' )
                    fn.call( win, win, function( module ) {
                        return _modules[ module.toLowerCase() ];
                    }, Add );
            } );
        }

        _GViK.Get = function() {
            return _modules;
        };

        win._GViK = _GViK;


    } )
    .call( null, window );