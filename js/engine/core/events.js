/*
 *
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {

    "use strict";



    var core = require( 'core' ),
        chrome = require( 'chrome' ),


        _data = {},

        Events = function() {};


    function __run( name, data ) {

        var fnlist = _data[ name ].events,
            l = fnlist.length;

        if ( l === 1 ) 
            return fnlist[ 0 ]( data, name );


        while ( l-- ) 
            fnlist[ l ]( data, name );
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


    Events.prototype.hasEvent = function( name ) {
        return _data.hasOwnProperty( name );
    };



    Events.prototype.create = function( name, initData, initEvent, onAdd ) {

        var _eventsL = [];

        if ( this.hasEvent( name ) && !_data[ name ]._created )
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


    Events.prototype.bind = function( name, fn, runnow ) {
        if ( core.isPlainObject( name ) )
            core.each( name, function( _fn, _name ) {
                __bind( _name, _fn, fn );
            } );

        else if ( typeof fn === 'function' ) {

            if ( typeof name === 'string' )
                __bind( name, fn, runnow );
            else if ( Array.isArray( name ) )
                core.each( name, function( n ) {
                    __bind( n, fn, runnow );
                } );
        }


        return this;
    };


    Events.prototype.del = function( evName ) {
        if ( this.hasEvent( evName ) )
            delete _data[ evName ];
    };


    Events.prototype.chromeTrigger = function( name, data ) {
        if ( chrome || ( chrome = require( 'chrome' ) ) )
            chrome.sendRequest( 'triggerEvent', {
                data: {
                    ev: name,
                    dt: data
                },
                forceCS: true
            } );

        return this;
    };


    Events.prototype.trigger = function( name, data, chromeTrigger ) {
        if ( this.hasEvent( name ) )
            __run( name, data );



        if ( chromeTrigger )
            this.chromeTrigger( name, data );



        return this;
    };

    Events.prototype.asyncTrigger = function( name, data, ms, chromeTrigger ) {
        if ( this.hasEvent( name ) )
            return setTimeout( function() {
                __run( name, data );
            }, ms || 15 );

        return this;
    };


    Events.prototype.getEvent = function() {
        return _data;
    };


    var _event = new Events();


    _event

        .create( 'resize', function() {
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
        if ( _data.initData() ) _data.events.shift()();
    } );



    Add( 'events', _event );


} );