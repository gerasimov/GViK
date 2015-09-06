/**
 *
 *
 *
 *
 *
 *
 *
 */

GViK(function(gvik, require, Add) {
  'use strict';

  var __constants = {
    DEBUG: true,

    CHROME_RESPONSE: 'gvik-response',
    CHROME_REQUEST: 'gvik-call',
    CHROME_CSREQUEST: 'gvik-callCS',
    CHROME_REQUEST_SYNC: 'gvik-callSync',
    CHROME_DISCONNECT: 'gvik-disconnect',
    CHROME_CS_RESPONSE_NAME: 'gvik-result',

    CHROME_FORCE_CS_RUN: true,

    CACHE_CLEAR_TIMEOUT: 10 * (60 * 1000),

    SIDEBAR_LASTFM_TOP_TRACKS_LIMIT: 500,

    GOOGLE_ANALYTICS_CODE: 'UA-51509924-1',

    GLOBAL_KEY_AUDIOPLAYER_TIMEOUT: 30,

    VKAPI_APP_ID: 2224353,
    VKAPI_KEY_STORAGE: 'vk',
    VKAPI_ROOT_URL: 'https://api.vk.com/method/',

    LASTFM_UPDATE_DELAY: 20,

    BITRATE_TIMEOUT: 100,

    CORE_PATH: 'engine/core/',
    PLUGIN_PATH: 'includes/plugin/',

    LOADER_TIMEOUT: 1000

  };

  Add('constants', {
    get: function(key) {
      if (!__constants.hasOwnProperty(key)) {
        throw new Error('Not defined ' + key);
      }

      return __constants[ key ];
    },

    define: function(name, val) {
      if (!__constants.hasOwnProperty(name)) {
        __constants[ name ] = val;
      }

    }
  });

});
