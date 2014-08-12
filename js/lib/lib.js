/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */
GViKModule.Check( {}, [], function( gvik ) {

    if ( typeof gvik !== 'undefined' && gvik.DEBUG ) console.log( gvik )

    "use strict";

    var core = gvik.core;



    var decoder = document.createElement( 'textarea' ),

        getToken = function( arr ) {
            var i = !arr.length ? '' : '(?!(' + arr.join( '|' ) + '))';
            return new RegExp( i + '\\&(?:[a-z]{2,7}|\\#x?[0-9a-z]{2,6})\\;', 'ig' )
        };

    GViKModule.Add( 'util', {
        unes: function( str ) {
            var noSpecialChar = [],
                after,
                i = 0,
                token,
                l = 30;

            for ( ; i < l; i++ ) {
                token = getToken( noSpecialChar );
                if ( !token.test( str ) ) {
                    break;
                }

                str = str.replace( token, function( before ) {
                    decoder.innerHTML = before;
                    after = decoder.value;
                    if ( before !== after ) {
                        return after;
                    }
                    noSpecialChar.push( before );
                    return before;
                } )
            }
            return str;
        },
        tmpl: function( str, obj ) {
            return str.replace( /\<\%\=[^\>]*\>/gi, function( key ) {
                return obj[ key.slice( 3, -1 ) ];
            } );
        }
    } );

    var pref = function( key ) {
        return [ 'gvik', key, gvik.UNIQ_ID ].join( '-' );
    };

    var getStorage = function( storageName ) {
        return {
            get: function( key ) {
                return window[ storageName ].getItem( pref( key ) );
            },
            set: function( key, val, fn ) {
                if ( core.isPlainObject( key ) ) {
                    core.each( key, function( v, k ) {
                        this.set( k, v, fn );
                    }.bind( this ) );
                } else {
                    window[ storageName ].setItem( pref( key ), fn ? fn( val ) : val );
                }
            },
            has: function( key ) {
                return window[ storageName ].hasOwnProperty( pref( key ) );
            },
            remove: function( key ) {
                window[ storageName ].removeItem( pref( key ) );
            },
            setJSON: function( key, val ) {
                this.set( key, val, function( data ) {
                    return JSON.stringify( data );
                } );
            },
            getJSON: function( key ) {
                return JSON.parse( this.get( key ) || '0' ) || null;
            }
        };
    }

    GViKModule.Add( {
        local: getStorage( 'localStorage' ),
        session: getStorage( 'sessionStorage' )
    } );

    /**
     *
     *
     */


    var events = {
        DOMLoad: [],
        resize: []
    };

    function MyEvent() {

        window.addEventListener( 'resize', function() {
            run( 'resize', makeSize() )
        }, false );

        document.addEventListener( 'DOMContentLoaded', function() {
            run( 'DOMLoad' );
            events.DOMLoad.length = 0;
        }, false )

    }

    function run( key, data ) {
        core.each( events[ key ], function( fn ) {
            fn( data );
        }, true );
        return true;
    }

    function checkState( key, ifelse, func, arg ) {
        if ( typeof func !== 'function' ) {
            return;
        }
        events[ key ].push( func );
        if ( typeof ifelse === 'function' ) {
            ifelse() && func( arg )
        }
    }

    function makeSize() {
        return {
            h: document.documentElement.clientHeight,
            w: document.documentElement.clientWidth
        }
    }

    MyEvent.prototype.hasEvent = function( eventName ) {
        return events[ eventName ] !== undefined;
    };

    MyEvent.prototype.DOMLoad = function( func ) {
        checkState( 'DOMLoad', function() {
            return document.body
        }, func )
    };

    MyEvent.prototype.trigger = function( eventName, data ) {
        if ( this.hasEvent( eventName ) ) {
            return run( eventName, data );
        }
        return this;
    };

    MyEvent.prototype._add = function( eventName, ifelse ) {

        if ( this.hasEvent( eventName ) ) {
            return false;
        }


        this[ eventName ] = ( function( self ) {
            return function( func, arg ) {
                checkState( eventName, ifelse, func );
                return this;
            }
        }( this ) );

        events[ eventName ] = [];
    };

    MyEvent.prototype.customEvent = function( eventName, ifelse ) {

        if ( typeof eventName === 'object' ) {
            core.each( eventName, function( v, k ) {
                this._add( k, v )
            } )
        } else {
            this._add( eventName, ifelse )
        }
        return this;
    };

    MyEvent.prototype.on = function( eventName, ifelse, func ) {
        if ( this.hasEvent( eventName ) ) {
            this[ eventName ]( func || ifelse )
        } else {
            this.customEvent( eventName, ifelse );
            func && this[ eventName ]( func )
        }
        return this;
    };

    MyEvent.prototype.bind = function( evArr, fn ) {

        gvik.core.each( evArr, function( evName ) {
            this.on( evName, null, fn );
        }.bind( this ) );

        return this;
    };

    MyEvent.prototype.off = function( eventName ) {
        if ( this.hasEvent( eventName ) ) {
            delete events[ eventName ];
            delete this[ eventName ]
        }
        return this;
    };

    MyEvent.prototype.resize = function( func ) {
        if ( typeof func !== 'function' ) {
            return;
        }
        events.resize.push( func );
        run( 'resize', makeSize() )
    };

    GViKModule.Add( {
        event: new MyEvent
    } );

    var elements = [];

    gvik.event.DOMLoad( function() {
        var body = document.body;

        core.each( elements, function( el ) {
            body.appendChild( el );
        } );

        elements.length = 0;
    } )

    gvik.dom.appendBody = function appendBody( el ) {
        var body = document.body;
        body ? body.appendChild( el ) : elements.push( el );
    }

} );

/**
 * @author Gerasimov Ruslan
 *
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


GViKModule.Check( {}, [], function( gvik ) {


    if ( typeof gvik !== 'undefined' && gvik.DEBUG ) console.log( gvik )

    "use strict";

    // id element => event name
    var events = {
            'gp': 'playerOpen',
            'pad_cont': 'padOpen',
            'wrap3': 'changePage',
            'audio': 'audio',
            'im_content': 'IM',
            'groups_list_content': 'groups',
            'settings_panel': 'settings'
        },
        core = gvik.core;
    if ( typeof gvik !== 'undefined' && gvik.DEBUG ) console.log( core )


    core.each( events, function( val, key ) {
        gvik.event.on( val, null )
    } );


    var checkEvents = function( even, cnt ) {
        if ( ( cnt = document.getElementById( 'content' ) ) )
            core.each( cnt.children, function( el, elid, ev ) {
                if ( ( elid = el.id ) && ( ev = events[ elid ] ) ) {
                    gvik.event.trigger( ev );
                }
            } );
    };

    gvik.event.DOMLoad( checkEvents );
    gvik.event.changePage( checkEvents );

    new WebKitMutationObserver( function( mutations ) {

        var i = 0,
            l = mutations.length,
            ev,
            id,
            curEl,
            lastId;

        for ( ; i < l; i++ ) {
            curEl = mutations[ i ].target;

            if ( ( id = curEl.id ) && ( lastId !== id ) && ( ev = events[ id ] ) ) {

                lastId = id;
                gvik.event.trigger( ev, {
                    el: curEl,
                    fired: curEl.fired
                } );

                curEl.fired = true;
            }
        }

    } )
        .observe( document, {
            subtree: true,
            childList: true
        } );


    Function.prototype.bindFuncAfter = function( fn ) {
        var curFn = this;
        return function() {
            var res = curFn.apply( this, arguments );
            fn.apply( this, [ arguments, res ] );
            return res;
        }
    }

} );