/*
 *
 *
 *
 *
 */

_GViK.Init( function( gvik, require ) {

	"use script";



	var core = require( 'core' ),
		chrome = require( 'chrome' ),


		_data = {},

		Event = function() {};


	function __run( name, data ) {
		var fnlist = _data[ name ].events,
			l = fnlist.length;

		for ( ; l--; ) fnlist[ l ]( data );
	}


	function __init( _n, _fn ) {
		var argdt;
		if ( _data[ _n ].initData )
			argdt = _data[ _n ].initData();
		_fn( argdt );
	};


	function __bind( name, fn, runnow ) {
		if ( !_data[ name ] ) _data[ name ] = {
			events: []
		};

		_data[ name ].events.push( fn );

		if ( runnow && ( runnow === true || runnow() ) )
			__init( name, fn );

	}


	Event.prototype.hasEvent = function( name ) {
		return _data.hasOwnProperty( name );
	};


	Event.prototype.create = function( name, initData, initEvent, onadd ) {

		_data[ name ] = {
			events: []
		};

		_data[ name ].initData = initData;
		_data[ name ].onadd = onadd;


		if ( typeof initEvent === 'function' ) initEvent( function() {
			__run( name, initData() );
		} );

		return this;
	};


	Event.prototype.bind = function( name, fn, runnow ) {
		if ( core.isPlainObject( name ) ) {
			core.each( name, function( _fn, _name ) {
				__bind( _name, _fn, fn );
			} );
		} else if ( typeof fn === 'function' ) {
			if ( typeof name === 'string' )
				__bind( name, fn, runnow );
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


	Event.prototype.getEvent = function() {
		return _data;
	};


	var _event = new Event;


	_event.create( 'resize', function() {
		return {
			h: document.documentElement.clientHeight,
			w: document.documentElement.clientWidth
		}
	}, function( fn ) {
		window.addEventListener( 'resize', fn, false );
	} );



	_GViK.Add( 'event', _event );


} );