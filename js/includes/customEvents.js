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
        chrome = require( 'chrome' ),
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

                }
                lastId = id;
            }

        } )
        .observe( document.body, {
            subtree: true,
            childList: true
        } );



    function bindFuncAfter( curFn, fn, ctx ) {
        return function() {
            var res = curFn.apply( this, arguments );
            res = fn.apply( ctx, [ arguments, res ] ) || res;
            return res;
        };
    };

    function bindFuncBefore( curFn, fn, ctx ) {
        return function() {
            return curFn.apply( ctx, fn.apply( ctx, [ arguments ] ) || arguments );
        };
    };


    function bindHandle( fnPath, fn, bef, noallowrebind ) {

        var path = fnPath.split( '.' ),
            curParent = window,
            curFn,
            curProp,

            curK = bef ? '_bef_ready' : '_aft_ready',
            Fn = bef ? bindFuncBefore : bindFuncAfter,
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

            curParent[ curProp ] = Fn( curParent[ curProp ], fn, curParent );
            curParent[ curProp ][ curK ] = 1;
        }
    }

    bindHandle( 'showBox', function( arg, res ) {
        events.trigger( 'openBox', {
            arg: arg,
            res: res
        } );
    }, true );

    bindHandle( 'hab.setLoc', function( _ ) {
        events.trigger( 'changeURL', _ );
    } );



    events.bind( 'changePage', function( even, cnt ) {

        if ( ( cnt = document.getElementById( 'content' ) ) === null ) return;

        var el,
            elid,
            ev,
            ch = cnt.children,
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


    .bind( 'audio_edit_box', function( _ ) {} )

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
                events.trigger( 'audio.newRows', [ arg, res ] );
            }, false, true );
        } );

    }, true )


    .bind( 'playerOpen', function( data, evname, scope ) {

        scope.startReady = false;
        scope.lastId = "";


        bindHandle( 'audioPlayer.operate', function( arg ) {

            scope.trackId = arg[ 0 ];

            if ( !scope.lastId )
                events.trigger( 'audio.globalStart' );


            if ( scope.trackId !== scope.lastId ) {
                events.trigger( 'audio.onNewTrack', scope.trackId );
                scope.startReady = false;
                scope.lastId = scope.trackId;
            }


            if ( audioPlayer.player.paused() )
                events.trigger( 'audio.pause', scope.trackId );
            else
                events.trigger( 'audio.start', scope.trackId );

        } );



        bindHandle( 'audioPlayer.setCurTime', function( arg ) {

            scope.curtime = arg[ 0 ];

            if ( scope.curtime < 20 ) {
                if ( !scope.startReady ) {
                    scope.startReady = true;
                    events.trigger( 'audio.onStartPlay' );
                }
            } else
                scope.startReady = false;

            events.trigger( 'audio.onPlayProgress', scope.curtime );
        }, true );



    } )


    chrome.globalFn( 'globalKey', function( command, res ) {
        events.trigger( 'globalKey', {
            command: command,
            res: res
        } );
    } );


} );