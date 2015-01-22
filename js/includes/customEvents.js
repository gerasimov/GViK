/**
 *
 *
 *
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {

    "use strict";

    var dom = require( 'dom' ),
        core = require( 'core' ),
        options = require( 'options' ),
        events = require( 'events' );



    // id element => event name
    var _events_map = {
        'gp': 'playerOpen',
        'pad_cont': 'padOpen',
        'wrap3': 'changePage',
        'audio': 'audio',
        'im_content': 'IM',
        'groups_list_content': 'groups',
        'settings_panel': 'settings'
    };


    new WebKitMutationObserver( function( mutations ) {

            var l = mutations.length,
                ev,
                id,
                curEl,
                lastId;

            for ( ; l--; ) {

                id = ( curEl = mutations[ l ].target ).id;

                if ( id && lastId !== id && ( ev = _events_map[ id ] ) ) {

                    events.trigger( ev, {
                        el: curEl
                    } );

                    lastId = id;
                }
            }

        } )
        .observe( document.body, {
            subtree: true,
            childList: true
        } );



    Function.prototype.bindFuncAfter = function( fn ) {
        var curFn = this;
        return function() {
            var res = curFn.apply( this, arguments );
            res = fn.apply( this, [ arguments, res ] ) || res;
            return res;
        };
    };

    Function.prototype.bindFuncBefore = function( fn ) {
        var curFn = this;
        return function() {
            return curFn.apply( this, fn.apply( this, [ arguments ] ) || arguments );
        };
    };


    function bindHandle( fnPath, fn, bef, noallowrebind ) {

        var path = fnPath.split( '.' ),
            curParent = window,
            curFn,
            curProp,

            curK = bef ? '_bef_ready' : '_aft_ready',
            curNameFn = bef ? 'bindFuncBefore' : 'bindFuncAfter',
            i = 0,
            l = path.length;

        for ( ; i < l; i++ ) {

            curProp = path[ i ];

            if ( !curParent[ curProp ] )
                return;

            if ( typeof curParent[ curProp ] !== 'function' ) {
                curParent = curParent[ curProp ];
                continue;
            }

            if ( noallowrebind && curParent[ curProp ][ curK ] )
                return;

            curParent[ curProp ] = curParent[ curProp ][ curNameFn ]( fn );
            curParent[ curProp ][ curK ] = 1;
        }
    }

    bindHandle( 'showBox', function( arg, res ) {
        events.trigger( 'openBox', {
            arg: arg,
            res: res
        } );
    } );

    bindHandle( 'hab.setLoc', function( _ ) {
        events.trigger( 'changeURL', _ );
    } );

    bindHandle( 'ajax.plainpost', function( arg ) {

        if ( arg[ 2 ] ) {
            arg[ 2 ] = arg[ 2 ].bindFuncBefore( function( arg ) {
                events.trigger( 'vk.ajax.done', arg );
            } );
        }

        if ( arg[ 3 ] ) {
            arg[ 3 ] = arg[ 3 ].bindFuncBefore( function( arg ) {
                events.trigger( 'vk.ajax.error', arg );
            } );
        }
    }, true );

    bindHandle( 'stManager.add', function( arg ) {

        events.trigger( 'stManager.add', arg );

        if ( arg[ 1 ] ) {
            arg[ 1 ] = arg[ 1 ].bindFuncBefore( function() {

                core.each( arg[ 0 ], function( fName ) {
                    events.trigger( fName + '.clb' );
                } );

                events.trigger( 'stManager.add.clb' );
            } );
        }

        return arg;
    }, true );


    bindHandle( 'nav.go', function( arg ) {
        if ( arg[ 2 ] ) {
            if ( !arg[ 2 ].onDone ) {
                arg[ 2 ].onDone = function() {
                    events.trigger( 'nav.go.clb' );
                };
            }else {
                arg[ 2 ].onDone = arg[ 2 ].onDone.bindFuncBefore( function() {} );
            }
        }
    }, true );

    events.bind( 'changePage', function( even, cnt ) {
        if ( ( cnt = document.getElementById( 'content' ) ) === null ) return;

        var el, elid, ev, ch = cnt.children,
            l = ch.length;

        for ( ; l--; )
            if ( ( el = ch[ l ] ) &&
                ( elid = el.id ) &&
                ( ev = _events_map[ elid ] ) )
                events.trigger( ev );
    } )

    .bind( 'openBox', function( _ ) {
        var arg = _.arg,
            res = _.res;

        events.trigger( arg[ 1 ].act, _ );
    } )


    .bind( 'audioEditBox', function( _ ) {

    } )

    .bind( 'disconnect', function() {
        console.error( 'disconnected GViK! Please reload VK pages!' );
    } )

    .bind( [
        'audio',
        'padOpen'
    ], function() {
        core.each( [
            'Audio.showRows',
            'Audio.scrollCheck'
        ], function( fnName ) {
            bindHandle( fnName, function( arg, res ) {
                events.trigger( 'audio.newRows', [ arg, res ]  );
            }, false, true );
        } );

    }, true )


    .bind( 'playerOpen', function() {

        Object.observe( window.audioPlayer, function( data ) {

            core.each( data, function( curData ) {
                switch ( curData.name ) {
                    case 'id':
                        events.trigger( 'audio.onNewTrack', curData.object.id, true );
                        break;
                    case 'curTime':
                        events.trigger( 'audio.onPlayProgress', curData.object.curTime, true );
                        break;
                    default:
                        break;
                }
            } )
        } );

        bindHandle( 'audioPlayer.operate', function( arg, res ) {
            if ( this && this.player ) events.trigger( ( this.player.paused() ? 'audio.onPause' : 'audio.onPlay' ), arg[ 0 ] );
        } );

    } );

    Object.observe( window.cur, function( data ) {

        core.each( data, function( curData ) {
            switch ( curData.name ) {
                case 'searchOffset':
                    events.trigger( 'audio.search' );
                    break;

                default:
                    break;
            }
        } );

    } );


} );