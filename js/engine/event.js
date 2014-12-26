/*
 *
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {

  "use script";



  var core = require( 'core' ),
    chrome = require( 'chrome' ),


    _data = {},

    Event = function() {};


  function __run( name, data ) {
    var fnlist = _data[ name ].events,
      l = fnlist.length;

    if ( !l )
      return;

    if ( l === 1 )
      return fnlist[ 0 ]( data );

    for ( ; l--; )
      fnlist[ l ]( data );
  }


  function __init( _n, _fn ) {
    var argdt;

    if ( _data[ _n ].initData )
      argdt = _data[ _n ].initData();

    _fn( argdt );
  }


  function __bind( name, fn, runnow ) {
    if ( !_data[ name ] )
      _data[ name ] = {
        events: []
      };


    _data[ name ].events.push( fn );

    if ( _data[ name ].onAdd )
      _data[ name ].onAdd();


    if ( runnow && ( runnow === true || runnow() ) )
      __init( name, fn );

  }


  Event.prototype.hasEvent = function( name ) {
    return _data.hasOwnProperty( name );
  };



  Event.prototype.create = function( name, initData, initEvent, onAdd ) {

    var _eventsL = [];

    if ( _data[ name ] && !_data[ name ]._created )
      _eventsL = _data[ name ].events;

    _data[ name ] = {
      events: _eventsL,
      _created: true
    };

    var _fn = function() {
      __run( name, initData() );
    };

    _data[ name ].initData = initData;

    if ( onAdd )
      _data[ name ].onAdd = function() {
        onAdd( _fn, _data[ name ] );
      };


    if ( typeof initEvent === 'function' )
      initEvent( _fn, _data[ name ] );

    return this;
  };


  Event.prototype.bind = function( name, fn, runnow ) {
    if ( core.isPlainObject( name ) )
      core.each( name, function( _fn, _name ) {
        __bind( _name, _fn, fn );
      } );

    else if ( typeof fn === 'function' ) {

      if ( typeof name === 'string' ) __bind( name, fn, runnow );
      else if ( Array.isArray( name ) )
        core.each( name, function( n ) {
          __bind( n, fn, runnow );
        } );
    }


    return this;
  };



  Event.prototype.trigger = function( name, data ) {
    if ( this.hasEvent( name ) ) {
      __run( name, data );
    }
    return this;
  };

  Event.prototype.asyncTrigger = function( name, data ) {
    if ( this.hasEvent( name ) ) {
      setTimeout( function() {
        __run( name, data );
      }, 15 );
    }
    return this;
  };


  Event.prototype.getEvent = function() {
    return _data;
  };


  var _event = new Event();


  _event.create( 'resize', function() {
    return {
      h: document.documentElement.clientHeight,
      w: document.documentElement.clientWidth
    };
  }, function( fn ) {
    window.addEventListener( 'resize', fn, false );
  } )

  .create( 'load', function() {
    return document.body;
  }, function( fn ) {
    document.addEventListener( 'DOMContentLoaded', fn, false );
  }, function( fn, _data ) {
    if ( _data.initData() )
      _data.events.shift()();
  } );



  Add( 'event', _event );


} );