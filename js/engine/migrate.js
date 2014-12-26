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

    var _add = function( name, fn ) {

      name = name.toLowerCase();

      win[ superUniqKey ][ name ] = ( typeof fn === 'function' ) ?
        fn.call( win, win ) :
        fn;
    };


    function Add( key, fn ) {


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
          } else for ( i in key ) _add( i, key[ i ] );
          break;
        case 2:
          _add( key, fn );
          break;
        default:
          break;
      }
    }

    function _GViK() {
      [].slice.call( arguments )
        .forEach( function( _ ) {
          if ( typeof _ === 'function' )
            _.call( win, win, function( module ) {
              return win[ superUniqKey ][ module.toLowerCase() ];
            }, Add );
        } );
    }

    _GViK.Get = function() {
      return win[ superUniqKey ];
    };

    win._GViK = _GViK;


  } )
  .call( window, window );