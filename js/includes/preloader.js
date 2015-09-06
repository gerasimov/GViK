/**
 *
 *
 *
 *
 *
 */

(function() {

  'use strict';

  if (window.GViK) {
    return;
  }

  var  MANIFEST = JSON.parse(sessionStorage.manifest);
  var APP_DATA = {
    APP_PATH: sessionStorage.apppath,
    APP_ID: sessionStorage.appid,
    IS_GVIK: true,
    JS_LIST: JSON.parse(sessionStorage.jslist),
    VERSION: MANIFEST.version,
    VERSION_INT: MANIFEST.version.replace(/\./g, ''),
    AUTHOR: MANIFEST.author,
    OS: navigator.platform.match(/^[a-z]+/i).pop()
  };

  var _modules = {};
  var require = function(moduleName) {
    moduleName = moduleName.toLowerCase();
    return _modules[ moduleName ];
  };
  var add = function(moduleName, moduleVal) {
    moduleName = moduleName.toLowerCase();
    if (!_modules[ moduleName ]) {
      _modules[ moduleName ] = moduleVal;
    }
  };
  var _export = {};

  function Add(nameMod, fnMod, noCallFnMod) {

    if (typeof nameMod === 'string') {
      return add(nameMod, (typeof fnMod === 'function' && !noCallFnMod) ?
            fnMod() :
            fnMod);
    }

    for (var nameProp in nameMod) {
      Add(nameProp, nameMod[ nameProp ]);
    }
  }

  function GViK(fOpt, fMods, initfunc) {

    if (typeof fOpt === 'function') {
      initfunc = fOpt;
      fMods = [];
      fOpt = {};
    }

    if (typeof fMods === 'function') {
      initfunc = fMods;
      if (Array.isArray(fOpt)) {
        fMods = fOpt;
        fOpt = {};
      } else {
        fMods = [];
      }
    }

    if (typeof initfunc === 'function') {

      if (!fMods.every(function(curModuleName) {
        return _modules.hasOwnProperty(curModuleName);
      })) {
        return;
      }

      if (require('options') !== undefined) {

        var options = require('options');
        var i;

        for (i in fOpt) {
          if (Array.isArray(fOpt[ i ])) {
            if (!fOpt[ i ].every(function(curOptName) {
              return options.get(i, curOptName);
            })) {
              return;
            }
          } else if (!options.get(i, fOpt[ i ])) {
            return;
          }
        }
      }

      initfunc.call(_export, APP_DATA, require, Add);
    }
  }

  window.GViK = GViK;

}).call(null, window);
