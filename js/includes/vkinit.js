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

  dom.setData( document.body, {
    'gvik-os': gvik.OS,
    'gvik-options': core.filter( {
        'audio-out-hide': '_hide-bit_',
        'common-remove-ads': '_ads_',
        'common-remove-white-heart': '_heart_',
        'common-remove-status': '_hide-status_'
      }, function( v, k ) {
        var keys = k.split( /-/g );
        return !options.get( keys.shift(), keys.join( '-' ) );
      } )
      .join( '' )
  } );


  // id element => event name
  var events = {
    'gp': 'playerOpen',
    'pad_cont': 'padOpen',
    'wrap3': 'changePage',
    'audio': 'audio',
    'im_content': 'IM',
    'groups_list_content': 'groups',
    'settings_panel': 'settings'
  };


  event.bind( 'changePage', function( even, cnt ) {

    if ( ( cnt = document.getElementById( 'content' ) ) === null ) return;

    var el, elid, ev,
      i = 0,
      ch = cnt.children,
      l = ch.length;

    for ( ; i < l; i++ )
      if (
        ( el = ch[ i ] ) &&
        ( elid = el.id ) &&
        ( ev = events[ elid ] )
      ) {
        event.asyncTrigger( ev );
      }
  } );

  new WebKitMutationObserver( function( mutations ) {

      var i = 0,
        l = mutations.length,
        ev,
        id,
        curEl,
        lastId;


      for ( ; i < l; i++ ) {
        curEl = mutations[ i ].target;

        if (
          lastId !== ( id = curEl.id ) &&
          ( ev = events[ id ] )
        ) {
          lastId = id;
          event.trigger( ev, {
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

      res = fn.apply( this, [
                arguments,
                res
            ] ) || res;

      return res;
    };
  };


  window.showBox = window.showBox.bindFuncAfter( function( arg, res ) {
    event.trigger( 'openBox', {
      arg: arg,
      res: res
    } );
  } );

  window.hab.setLoc = window.hab.setLoc.bindFuncAfter( function( _ ) {
    event.asyncTrigger( 'changeURL', _ );
  } );


  event

    .bind( 'openBox', function( _ ) {
      var arg = _.arg,
        res = _.res,
        typeBox = arg[ 1 ].act;

      switch ( typeBox ) {
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

      if ( !window.Audio )
        return;


      var showRows = window.Audio.showRows,
        scrollCheck = window.Audio.scrollCheck;

      if ( showRows && !showRows.__ready ) {
        window.Audio.showRows = showRows.bindFuncAfter( function( arg, res ) {
          event.trigger( 'newAudioRows', [ arg, res ] );
        } );
        window.Audio.showRows.__ready = true;
      }

      if ( scrollCheck && !scrollCheck.__ready ) {
        window.Audio.scrollCheck = scrollCheck.bindFuncAfter( function( arg, res ) {
          event.trigger( 'newAudioRows', [ arg, res ] );
        } );
        window.Audio.scrollCheck.__ready = true;
      }

    }, true )


  .bind( 'playerOpen', function() {
      window.audioPlayer.setCurTime = window.audioPlayer.setCurTime.bindFuncAfter( function( arg, res ) {

        event.trigger( 'onPlayAudio', {
          arg: arg,
          res: res
        } );
      } );
    } )
    .bind( 'onPlayAudio', function() {


    } );


} );