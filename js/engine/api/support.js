/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */
GViK(function() {

  'use strict';

  function hasSupport(namespace, fn) {
    return !!(chrome[ namespace ] && (chrome[ namespace ][ fn ] != null));
  }

  window.SUPPORT = {
    runtime: hasSupport('runtime', 'sendMessage'),
    storage: hasSupport('storage', 'sync'),
    downloads: hasSupport('downloads', 'download'),
    manifest: hasSupport('runtime', 'getManifest'),
    pageAction: hasSupport('pageAction', 'show'),
    tabs: hasSupport('tabs', 'query'),
    windows: hasSupport('windows', 'create'),
    nativeMessaging: hasSupport('runtime', 'sendNativeMessage')
  };

  window.CONFIG = {};

  CONFIG.sender = SUPPORT.runtime ? 'runtime' : 'extension';

}());
