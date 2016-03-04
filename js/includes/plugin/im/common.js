/*




*/

GViK(function(gvik, require, add) {

  'use strict';

  var options = require('options');
  var events = require('events');
  var CNFS = options.get('im');

  events.bind('IM', function(e) {

    if (!window.IM) {
      return;
    }

    if (CNFS.get('mark-read')) {
      IM.markRead = function(uid, msgIds) {};
      IM.markPeer = function() {};
    }

    if (CNFS.get('send-notify')) {
      IM.onMyTyping = function(uid) {};
    }

  }, true);

});
