/**
 *
 *
 *
 *
 *
 *
 */

GViK(function(gvik, require, Add) {

  'use strict';

  var dom = require('dom');
  var core = require('core');
  var options = require('options');
  var chrome = require('chrome');
  var events = require('events');

  // id element => event name
  var eventsMap = {
    'gp': 'playerOpen',
    'pad_cont': 'padOpen',
    'wrap3': 'changePage',
    'audio': 'audio',
    'im_content': 'IM',
    'groups_list_content': 'groups',
    'settings_panel': 'settings'
  };

  new WebKitMutationObserver(function(mutations) {

    var l = mutations.length;
    var ev;
    var id;
    var curEl;
    var lastId;

    for (; l--;) {

      if ((id = (curEl = mutations[ l ].target).id) &&
        lastId !== id && (ev = eventsMap[ id ])) {

        events.trigger(ev, {
          el: curEl
        });

      }
      lastId = id;
    }

  })
  .observe(document.body, {
    subtree: true,
    childList: true
  });

  core.decorator('showBox', function(arg, res) {
    events.trigger('openBox', {
      arg: arg,
      res: res
    });
  }, true);

  core.decorator('hab.setLoc', function(_) {
    events.trigger('changeURL', _);
  });

  events.bind('changePage', function(even, cnt) {

    if ((cnt = document.getElementById('content')) === null) {
      return;
    }

    var el;
    var elid;
    var ev;
    var ch = cnt.children;
    var l = ch.length;

    for (; l--;) {
      if ((el = ch[ l ]) && (elid = el.id) && (ev = eventsMap[ elid ])) {
        events.trigger(ev);
      }
    }
  })
    .bind('openBox', function(_) {
      events.trigger(_.arg[ 1 ].act, _);
    })
    .bind('audio_edit_box', function(_) {})
    .bind('disconnect', function() {
      console.error('disconnected GViK! Please reload VK pages!');
    })
    .bind([
        'audio',
        'padOpen'
    ], function() {
      core.each([
          'Audio.showRows',
          'Audio.scrollCheck'
        ], function(fnName) {
          core.decorator(fnName, function(arg, res) {
            events.trigger('audio.newRows', [arg, res]);
          }, false, true);
        });
    }, true)

    .bind('playerOpen', function(data, evname, scope) {

      scope.startReady = false;
      scope.lastId = '';

      core.decorator('audioPlayer.operate', function(arg) {
        if (audioPlayer.player.paused()) {
          events.trigger('audio.pause', scope.trackId);
        } else {
          events.trigger('audio.start', scope.trackId);
        }
      });

      core.decorator('audioPlayer.setCurTime', function(arg) {

        scope.curtime = arg[ 0 ];
        scope.trackId = audioPlayer.id;

        if (!scope.lastId) {
          events.trigger('audio.globalStart');
        }

        if (scope.trackId !== scope.lastId) {
          events.trigger('audio.onNewTrack', scope.trackId);
          scope.startReady = false;
          scope.lastId = scope.trackId;
        }

        if (scope.curtime < 10) {
          if (!scope.startReady) {
            scope.startReady = true;

            events.trigger('audio.onStartPlay');
          }
        } else {
          scope.startReady = false;
        }

        events.trigger('audio.onPlayProgress', scope.curtime);
      }, true);

    });

  chrome.globalFn('globalKey', function(command, res) {
    events.trigger('globalKey', {
      command: command,
      res: res
    });
  });

});
