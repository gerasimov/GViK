/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK(function(appData, require, add) {

  'use strict';

  var core = require('core');
  var chrome = require('chrome');
  var options = require('options');
  var constants = require('constants');
  var storage = require('storage');


  class VKAPI_new {
    
  }

  var VKAPI = function() {

    this.ROOT_URL = constants.get('VKAPI_ROOT_URL');
    this.KEY_TOKEN = constants.get('VKAPI_KEY_STORAGE');
    this.APP_ID = constants.get('VKAPI_APP_ID');
    this.USER_ID = constants.get('ID');

    this.permission = [  ];

    this.isOffline = options.get('vkapi', 'offline');

    if (this.isOffline) {
      this.pushPermission('offline');
    }

    this.saved = [];

  };

  var _fnReAuth = function(method, data, success, error) {

    storage.local.remove(this.KEY_TOKEN);
    chrome.local.remove(this.KEY_TOKEN);

    this.saved.push([method, data, success, error]);
    this.auth(null, null, null, false);
  };

  VKAPI.prototype = {

    get data() {
      return storage.local.getJson(this.KEY_TOKEN) || {};
    },

    get token() {
      return this.data.token;
    },

    _setToken: function(token) {

      storage.local.setJson(this.KEY_TOKEN, {
        token: token,
        isOffline: this.isOffline
      });

      chrome.local.set({
        vk: {
          token: token,
          isOffline: this.isOffline
        }
      });

    },

    _callSaved: function() {

      if (!this.saved.length) {
        return;
      }

      var cur = this.saved.shift();
      var method = cur.shift();
      var data = cur.shift();
      var success = cur.shift();
      var error = cur.shift();

      if (success === undefined) {
        return;
      }

      this.call(method, data, function() {
        success.apply(this, arguments);
        this._callSaved();
      }.bind(this), error);

    },
    _errIds: {
      '5': _fnReAuth,
      '10': _fnReAuth
    },
    runIdError: function(errId, args) {
      var errFn = this._errIds[ errId ];
      if (typeof errFn === 'function') {
        errFn.apply(this, args);
      }
    },
    call: function(method, data, success, error) {

      if (typeof data === 'function') {
        error = success;
        success = data;
        data = {};
      } else {
        data = data || {};
      }

      if (!data.no_auth) {
        if (!this.authorized ) {
          this.saved.push([method, data, success, error]);
          return this.auth();
        }
        data.access_token = this.token;
      }

      data.v = '5';
      data.https = 1;

      data._nocache = Date.now();

      chrome.simpleAjax({
        type: 'POST',
        url: this.ROOT_URL + method,
        dataType: 'json',
        data: data
      }, function(res) {
        if (res.hasOwnProperty('response')) {
          if (typeof success === 'function') {
            success(res.response);
          }
        } else if (res.hasOwnProperty('error')) {
          if (typeof error === 'function') {
            error(res.error);
          }
          this.runIdError.call(this, res.error.error_code, [method, data, success, error]);
        }
      }.bind(this), error);

      return this;
    },

    pushPermission: function(perName) {
      if (this.permission.indexOf(perName) === -1) {
        this.permission.push(perName);
      }
    },

    showWindowAuth: function(callback, error, _focus) {

      var width = parseInt(screen.width / 2);
      var height = parseInt(screen.height / 2);

      chrome.sendRequest('auth', {
        data: {
          url: 'https://oauth.vk.com/authorize?' + core.map({
            client_id: this.APP_ID,
            scope: this.permission /* || 474367*/ ,
            v: 5,
            redirect_uri: 'blank.html',
            display: 'popup',
            response_type: 'token'
          }, function(v, k) {
            return k + '=' + v;
          })
          .join('&'),

          width: width,
          height: height,
          top: parseInt(height / 3),
          left: parseInt(width / 2)
        },
        callback: function(token) {
          this._setToken.call(this, token);
          this._callSaved();
          callback && callback.apply(this, arguments);
        }.bind(this),
        error: error
      });
    },

    auth: function(force, callback, error, focus) {

      if (force || !this.authorized) {

        var kt = this.KEY_TOKEN;

        chrome.local.get({
          key: kt
        }, function(val) {

          if (!force && val[ kt ] && val[ kt ].token && this.isOffline === val[ kt ].isOffline) {
            this._setToken.call(this, val[ kt ].token);
            this._callSaved();
            return callback && callback(val[ kt ].token);
          }

          this.showWindowAuth(callback, error, false);

        }.bind(this));
      }
      return this;
    },

    get authorized() {
      return (this.token && this.token.length) &&
          (this.data.isOffline == this.isOffline);
    },

    _extend: function(name, fn) {
      if (!this[ name ] && core.isFunction(fn)) {
        this[ name ] = fn;
      }
    }
  };

  add('vkapi', new VKAPI);

});
