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
        event = require( 'event' );



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


        eventsKeys = Object.keys( events );


    new WebKitMutationObserver( function( mutations ) {

            var l = mutations.length,
                ev,
                id,
                curEl,
                lastId;

            for ( ; l--; ) {

                curEl = mutations[ l ].target;
                id = curEl.id;

                if ( lastId !== id && events.hasOwnProperty( id ) ) {

                    event.trigger( events[ id ], {
                        el: curEl
                    } );

                    if ( ( lastId = id ) === 'wrap3' ) return;
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
        event.trigger( 'openBox', {
            arg: arg,
            res: res
        } );
    } );

    bindHandle( 'hab.setLoc', function( _ ) {
        event.trigger( 'changeURL', _ );
    } );

    bindHandle( 'ajax.plainpost', function( arg ) {

        if ( arg[ 2 ] ) {
            arg[ 2 ] = arg[ 2 ].bindFuncBefore( function( arg ) {
                event.trigger( 'vk.ajax.done', arg );
            } );
        }

        if ( arg[ 3 ] ) {
            arg[ 3 ] = arg[ 3 ].bindFuncBefore( function( arg ) {
                event.trigger( 'vk.ajax.error', arg );
            } );
        }
    }, true );

    bindHandle( 'stManager.add', function( arg ) {
        event.trigger( 'stManager.add', arg );

        if ( arg[ 1 ] ) {
            arg[ 1 ] = arg[ 1 ].bindFuncBefore( function() {
                core.each( arg[ 0 ], function( fName ) {
                    event.trigger( fName + '.clb' );
                } );
            } );
        }

        return arg;
    }, true );

    event.bind( 'changePage', function( even, cnt ) {
        if ( ( cnt = document.getElementById( 'content' ) ) === null ) return;
        var el, elid, ev, ch = cnt.children,
            l = ch.length;
        for ( ; l--; )
            if ( ( el = ch[ l ] ) && ( elid = el.id ) && ( ev = events[ elid ] ) ) event.trigger( ev );
    } )

    .bind( 'openBox', function( _ ) {
        var arg = _.arg,
            res = _.res;

        switch ( arg[ 1 ].act ) {
            case "edit_audio_box":
                event.trigger( "audioEditBox", _ );
                break;
            default:
                break;
        }
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
                    event.trigger( 'audio.newRows', [ arg, res ] );
                }, false, true );
            } );

        }, true )


    .bind( 'playerOpen', function() {

        Object.observe( window.audioPlayer, function( data ) {

            core.each( data, function( curData ) {
                switch ( curData.name ) {
                    case 'id':
                        event.trigger( 'audio.onNewTrack', curData.object.id, true );
                        break;
                    case 'curTime':
                        event.trigger( 'audio.onPlayProgress', curData.object.curTime, true );
                        break;
                    default:
                        break;
                }
            } )
        } );

        bindHandle( 'audioPlayer.operate', function( arg, res ) {
            if ( this && this.player ) event.trigger( ( this.player.paused() ? 'audio.onPause' : 'audio.onPlay' ), arg[ 0 ] );
        } );

    } );



} );