/*
 *
 *
 *
 *
 */

GViK(function(gvik, require, add) {

  'use strict';

  var core = require('core');
  var  chrome = require('chrome');
  var _data = {};
  var rC = /\s*\,\s*/;
  var Events = function() {};

  function __run(name, data) {
    var fnlist = _data[ name ].events;
    var $scope = _data[ name ].$scope;
    var i = 0;
    var l = fnlist.length;

    if (l === 1) {
      return fnlist[ 0 ](data, name, $scope);
    }

    for (; i < l; i++) {
      fnlist[ i ](data, name, $scope);
    }
  }

  function __init(name, fn) {
    var argdt;

    if (_data[ name ].initData) {
      argdt = _data[ name ].initData();
    }

    fn(argdt, name, _data[ name ].$scope);
  }

  function __bind(name, fn, runnow) {

    if (!_data[ name ]) {
      _data[ name ] = {
        events: [],
        $scope: {
          _get: function(name) {
            return _data[ name ].$scope;
          }
        }
      };
    }

    _data[ name ].events.push(fn);

    if (_data[ name ].onAdd) {
      _data[ name ].onAdd();
    }

    if (runnow && (runnow === true || runnow())) {
      __init(name, fn);
    }

  }

  Events.prototype.hasEvent = function(name) {
    return _data.hasOwnProperty(name);
  };

  Events.prototype.create = function(name, initData, initEvent, onAdd) {

    var _eventsL = [];
    var $scope = {
      _get: function(name) {
        return _data[ name ].$scope;
      }
    };

    if (this.hasEvent(name) && !_data[ name ]._created) {
      _eventsL = _data[ name ].events;
      $scope = _data[ name ].$scope;
    }

    _data[ name ] = {
      events: _eventsL,
      $scope: $scope,
      _created: true
    };

    var _fn = function() {
      __run(name, initData());
    };

    _data[ name ].initData = initData;

    if (onAdd) {
      _data[ name ].onAdd = function() {
        onAdd(_fn, _data[ name ]);
      };
    }

    if (typeof initEvent === 'function') {
      initEvent(_fn, _data[ name ]);
    }

    return this;
  };

  Events.prototype.bind = function(name, fn, runnow) {
    if (core.isPlainObject(name)) {
      core.each(name, function(_fn, _name) {
        __bind(_name, _fn, fn);
      });
    } else if (typeof fn === 'function') {
      if (typeof name === 'string') {
        __bind(name, fn, runnow);
      } else if (Array.isArray(name)) {
        core.each(name, function(n) {
          __bind(n, fn, runnow);
        });
      }
    }

    return this;
  };

  Events.prototype.del = function(evName) {
    if (this.hasEvent(evName)) {
      delete _data[ evName ];
    }
  };

  Events.prototype.chromeTrigger = function(name, data) {
    if (chrome || (chrome = require('chrome'))) {
      data = {
        ev: name,
        dt: data
      };

      chrome.sendRequest('triggerEvent', {
        data: data,
        forceCS: true
      });
    }

    return this;
  };

  Events.prototype.trigger = function(name, data, chromeTrigger) {
    if (typeof name === 'string') {
      name = name.split(rC);
    }

    core.each(name, function(_name) {
      if (this.hasEvent(_name)) {
        __run(_name, data);
      }

      if (chromeTrigger) {
        this.chromeTrigger(_name, data);
      }
    }, this);

    return this;
  };

  Events.prototype.asyncTrigger = function(name, data, ms, chromeTrigger) {
    var _this = this;

    setTimeout(function() {
      _this.trigger(name, data, chromeTrigger);
    }, ms || 15);

    return this;
  };

  Events.prototype.getEvent = function() {
    return _data;
  };

  Events.prototype.callback = function(eventName, async) {
    var _this = this;
    return function(data) {
      if (async) {
        _this.asyncTrigger(eventName, data);
      } else {
        _this.trigger(eventName, data);
      }
    };
  };

  var _event = new Events();

  _event
  .create('resize', function() {
      return {
        h: document.documentElement.clientHeight,
        w: document.documentElement.clientWidth
      };
    }, function(fn) {
      window.addEventListener('resize', fn, false);
  })

  .create('load', function() {
      return document.body;
    }, function(fn) {
      document.addEventListener('DOMContentLoaded', fn, false);
    }, function(fn, _data) {
      if (_data.initData()) {
        _data.events.shift()();
      }
    });

  add('events', _event);

});
