/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

"use strict";

;
( function( gvik ) {

    var

        PREFIX = 'gvik',

        core = gvik.core,

        setPrefix = function() {
            var arg = core.toArray( arguments );
            arg.unshift( PREFIX );
            return arg.join( '-' );
        },

        /*ELEMENT_ID = setPrefix( 'chrome' ),*/


        RESPONSE = setPrefix( 'response' ),
        REQUEST = setPrefix( 'call' ),
        CSREQUEST = setPrefix( 'callCS' ),
        REQUEST_SYNC = setPrefix( 'callSync' ),
        DISCONNECT = setPrefix( 'disconnect' ),

        CS_RESPONSE_NAME = setPrefix( 'result' ),

        UNIQ_ID = gvik.UNIQ_ID,

        disconnected = false;


    var chromeElement = document.documentElement;

    /*document.getElementById( ELEMENT_ID )*/
    ;


    function connect( evName, fn ) {
        chromeElement.addEventListener( evName, function( e ) {
            var data = {};
            if ( e.detail ) {
                data = e.detail.data;
            }

            fn( data, e );
        }, false );
    }

    connect( RESPONSE, function( data ) {
        callCallback( data.callback, data.arg );
    } );

    connect( DISCONNECT, function() {
        disconnected = true;
        gvik.event.trigger( 'disconnect' );
    } );

    function callCallback( fnId, arg ) {
        if ( has( fnId ) ) {
            return get( fnId )
                .apply( this, arg )
        }
    }

    var callbackContainer = [

            function() {
                var args = core.toArray( arguments );
                args.unshift( 'defaultFn' );
                console.log.apply( console, args );
            }
        ],
        defaultFn = 0;

    function makeFnId( fn ) {

        if ( !fn ) {
            return defaultFn;
        }

        var fnId = callbackContainer.length;

        callbackContainer.push( function() {
            fn.apply( this, arguments );
            remove( fnId );
        } );

        return fnId;
    }

    function get( fnId ) {
        return callbackContainer[ fnId ];
    }

    function has( fnId ) {
        return callbackContainer[ fnId ] !== undefined;
    }

    function remove( fnId ) {
        callbackContainer[ fnId ] = undefined;
    }

    var _chrome = {
        get disconnected() {
            return disconnected;
        }
    };

    function sendRequest( method, sys, callback, error ) {

        var params = sys.params || {},
            callName = disconnected || sys.forceCS ? CSREQUEST : REQUEST,
            eventTrigger;

        params.uid = UNIQ_ID;
        params.callback = makeFnId( sys.callback || callback );
        params.error = makeFnId( sys.error || error );
        params.method = method;

        eventTrigger = new CustomEvent( callName, {
            detail: {
                data: sys.data,
                params: params
            },
            bubbles: false
        } );

        chromeElement.dispatchEvent( eventTrigger );

        return _chrome;
    }
    _chrome.sendRequest = sendRequest;

    _chrome.simpleAjax = function( data, callback, error ) {

        return sendRequest( 'simpleAjax', {
            data: data,
            callback: callback,
            error: error,
            forceCS: true
        } );
    };

    _chrome.sendTabs = function( eventName, data, needCur, callback, error ) {
        return sendRequest( 'sendTabs', {
            data: data,
            params: {
                eventName: eventName,
                needCur: needCur
            },
            callback: callback,
            error: error
        } )
    };

    _chrome.openTab = function( url, obj, params ) {

        params = params || {};

        if ( !params.chrome && !/https?\:\/\//.test( url ) ) {
            url = location.origin + '/' + url;
        }

        return sendRequest( 'openTab', {
            data: core.extend( {
                url: url,
                active: true
            }, obj || {} ),
            params: params
        } );
    };

    _chrome.sendEvent = function( events ) {
        return sendRequest( 'sendEvent', {
            data: {
                events: events
            }
        } );
    };

    function sendRequestSync( method, arg ) {
        var event = new CustomEvent( REQUEST_SYNC, {
            detail: {
                method: method,
                arg: arg
            },
            bubbles: true
        } );

        chromeElement.dispatchEvent( event );

        return sessionStorage[ CS_RESPONSE_NAME ];
    }
    _chrome.globalFn = function( key, fn, context ) {
        callbackContainer[ key ] = context ? fn.bind( context ) : fn;
        return this;
    };


    _chrome.globalFn( 'updateSettings', function( opt ) {
        console.log( opt );
    } );


    function setStorageitem( vals, callback, storageName ) {
        var data = {};

        core.each( vals, function( val, key ) {
            data[ ( key + '::' + UNIQ_ID ) ] = val;
        } );

        return sendRequest( storageName, {
            data: data,
            params: {
                forceCS: true
            },
            callback: callback
        } )
    }

    function getStorageitem( obj, callback, storageName ) {

        var key = obj.key ?
            ( obj.key + '::' + UNIQ_ID ) :
            null;

        return sendRequest( storageName, {
            data: {
                key: key
            },
            params: {
                forceCS: true
            },
            callback: function( vals ) {
                var result = core.toObject( core.map( vals, function( res, key ) {
                    return [ key.split( '::' )
                        .slice( 0, -1 )
                        .join( '::' ), res
                    ];
                } ) );

                callback( result );
            }
        } )
    }

    function removeStorageitem( key, callback, storageName ) {
        return sendRequest( storageName, {
            data: {
                key: key + '::' + UNIQ_ID
            },
            params: {
                forceCS: true
            }
        } )
    }

    _chrome.lang = function( word ) {
        return sendRequestSync( 'lang', word );
    };


    core.each( [ 'Sync', 'Local' ], function( storageName ) {
        _chrome[ storageName.toLowerCase() ] = {};
        core.each( {
            get: getStorageitem,
            set: setStorageitem,
            remove: removeStorageitem
        }, function( storFn, storFnName ) {
            _chrome[ storageName.toLowerCase() ][ storFnName ] = function( f, s ) {
                return storFn( f, s, storFnName + storageName );
            };
        } );
    }, true );


    _chrome.download = {
        download: function( data, callback ) {
            return sendRequest( 'download', {
                data: data,
                callback: callback
            } );
        },
        downloadFromCache: function( data, callback ) {
            return sendRequest( 'downloadFromCache', {
                data: data,
                callback: callback
            } );
        },
        showShelf: function() {
            return sendRequest( 'setShelfEnabled', {
                data: {
                    state: true
                }
            } );
        },
        hideShelf: function() {
            return sendRequest( 'setShelfEnabled', {
                data: {
                    state: false
                }
            } );
        }
    };


    _chrome.executeScript = function( code, callback ) {
        return sendRequest( 'executeScript', {
            data: {
                code: code
            },
            callback: callback
        } );
    };

    _chrome.getSupport = function( callback ) {
        return sendRequest( 'getSupport', {}, callback );
    };



    _chrome.ga = function() {
        return sendRequest( 'ga', {
            data: {
                arg: core.toArray( arguments )
            }
        } );
    }


    if ( gvik.IS_GVIK ) {
        gvik.Add( 'chrome', _chrome );
    } else {
        gvik.chrome = _chrome;
    }



}( window.gvik || window ) );