/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK(function(gvik, require, Add) {
  "use strict";

  var options = require('options');
  var dom = require('dom');
  var chrome = require('chrome');
  var vkapi = require('vkapi');
  var global = require('global');
  var events = require('events');
  var constants = require('constants');
  var core = require('core');

  dom.setData(document.body, {
    'gvik-os': gvik.OS,
    'gvik-options': core.filter({
      'audio-out-hide': '_hide-bit_',
      'common-remove-ads': '_ads_',
      'common-remove-white-heart': '_heart_'
    }, function(v, k) {
      var keys = k.split(/-/g);
      return !options.get(keys.shift(), keys.join('-'));
    })
    .join('')
  });
 
  if (options.get('common', 'state-onlineChange')) {

    if (options.get('common', 'set-offline')) {
      events.bind('changePage', function() {
        vkapi.call('account.setOffline');
      }, true);

    } else if (options.get('common', 'set-online')) {
      (function fn() {
        vkapi.call('account.setOnline', {}, function() {
          setTimeout(fn, (14 * 60) * 1000);
        });
      }());
    }
  }

  if (options.get('wall', 'disable-wide')) {

    var blockedClasses = [
        'wide_wall_module',
        'page_wide_no_narrow'
    ];

    window.addClass = function(obj, name) {
      if (blockedClasses.indexOf(name) === -1) {
        if ((obj = ge(obj)) && !hasClass(obj, name)) {
          obj.className = (obj.className ? obj.className + ' ' : '') + name;
        }
      }
    };

    core.each(blockedClasses, function(cls) {
      var els = dom.byClass(cls);
      core.each(els, function(el) {
        dom.removeClass(el, cls);
      });
    });

  }

  window.rs = core.tmpl3;


});
