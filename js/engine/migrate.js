/**
 *
 *
 *
 */

if ( typeof _GViK === 'undefined' )( function( win ) {

        "use strict";

        var _modules = {},

            _add = function( name, fn, nocallfn ) {
                _modules[ name.toLowerCase() ] = ( typeof fn === 'function' && !nocallfn ) ?
                    fn.call( win, win ) :
                    fn;
            };



        function _GViK() {
            [].forEach.call( arguments, function( fn ) {
                if ( typeof fn === 'function' )
                    fn.call( win, win, function( module ) {
                        return _modules[ module.toLowerCase() ];
                    }, function( key, fn, nocallfn ) {

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
                    } );
            } );
        }

        _GViK.Get = function() {
            return _modules;
        };

        win._GViK = _GViK;


    } )
    .call( null, window );