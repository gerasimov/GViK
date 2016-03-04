/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK(function(gvik, require, Add) {

  'use strict';

  var dom = require('dom');
  var core = require('core');
  var constants = require('constants');
<<<<<<< HEAD

=======
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
  var appPath = chrome.extension.getURL('');
  var risEngine = /^js\/engine\//;
  var rIsIncludes = /^js\/(?:includes|lib)\//;

  function __init(manifest) {

    var includesJSList = [];
    var engineJSList = [];

    core.each(manifest.web_accessible_resources, function(fileName) {
<<<<<<< HEAD

=======
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      if (rIsIncludes.test(fileName)) {
        includesJSList.push(fileName);
      } else if (risEngine.test(fileName)) {
        engineJSList.push(fileName);
      }
    });

    engineJSList.unshift(includesJSList.shift());
    engineJSList.push(includesJSList.shift());

    core.extend(sessionStorage, {
      apppath: appPath,
      appid: appPath.split(/\/+/)[ 1 ],
      manifest: JSON.stringify(manifest),
      jslist: JSON.stringify(includesJSList)
    });

    core.define(engineJSList, {
      suffix: manifest.version,
      path: appPath
    });

  }

  if (SUPPORT.runtime) {
    __init(chrome.runtime.getManifest());
  } else {
    core.getResource('manifest.json', function(res) {
      __init(JSON.parse(res));
    });
  }
<<<<<<< HEAD

=======
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
});
