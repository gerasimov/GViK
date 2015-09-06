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

  var constants = require('constants');
  var __cache = new Map();
  var tId = setInterval(function() {
    __cache.clear();
  }, constants.get('CACHE_CLEAR_TIMEOUT'));

  Add('cache', {
    get: function(key) {
      return __cache.get(key);
    },
    set: function(key, val) {
      __cache.set(key, val);
    },
    del: function(key) {
      __cache.delete(key);
    },
    has: function(key) {
      return __cache.has(key);
    }
  });

});
