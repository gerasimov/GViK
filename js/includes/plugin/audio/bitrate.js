/*




 */

GViK({
  'audio': [
      'download-enable',
      'add-bit'
  ]
},
    function(appData, require, Add) {

      'use strict';

      var core = require('core');
      var dom = require('dom');
      var events = require('events');
      var global = require('global');
      var options = require('options');
      var cache = require('cache');
      var constants = require('constants');
      var chrome = require('chrome');

      var CONFS = options.get('audio');
      var FILE_SIZE_ENABLED = CONFS.get('file-size');
      var LOADER_DISABLED = CONFS.get('loader-disable');
      var MIN_BIT = CONFS.get('min-bitrate');
      var CLASS_BITRATE = ['gvik-bitrate', (LOADER_DISABLED ? '' : ' loader')].join('');
      var NAME_ATTR = ['data-gvik-bitrate', (FILE_SIZE_ENABLED ? '-filesize' : '')].join('');
      var AUDIO_SELECTOR = '.audio:not([id=audio_global]):not([' + NAME_ATTR + '])';
      var SORT_AUDIO_SELECTOR = '.audio:not([id=audio_global])[' + NAME_ATTR + ']';
      var SORT_PROP = 'bitInt';

      function __calcBitrate(size, dur, needFileSize) {
        var bitInt = ((size * 8) / dur / 1000) | 0;
        var sizeInt = size / (1024 * 1024) | 0;
        var formated = bitInt + 'kbps';

        if (needFileSize) {
          formated += ', ' + sizeInt + 'MB';
        }

        return {
          formated: formated,
          bitInt: bitInt,
          size: size,
          sizeInt: sizeInt
        };
      }

      var hideSmallBitrateFn = CONFS.get('auto-hide-bit') ? function(audios) {

        audios = audios || window.cur.sContent.children;

        for (var i = audios.length; i--;) {
          if (getCacheInt(audios[ i ].id) < MIN_BIT) {
            audios[ i ].style.display = 'none';
          }
        }
      } : null;

      var tId;

      var sortFn = CONFS.get('auto-sort-bit') ? function() {

        var audios = [].slice.call(window.cur.sContent.children)
            .sort(function(a, b) {
                return getCacheInt(b.id) - getCacheInt(a.id);
              });

        if (!audios.length) {
          return;
        }

        dom.append(window.cur.sContent, audios);

        return audios;

      } : null;

      var autoLoadBitFn = (hideSmallBitrateFn || sortFn) ? function(timeout) {

        clearTimeout(tId);

        if (!window.cur.searchStr) {
          return;
        }

        if (!timeout) {
          sortFn && sortFn();
          hideSmallBitrateFn && hideSmallBitrateFn();
          return;
        }

        tId = setTimeout(function() {
                sortFn && sortFn();
                hideSmallBitrateFn && hideSmallBitrateFn();
              }, constants.get('BITRATE_TIMEOUT'));

      } : null;

      function getCacheInt(id) {
        return (cache.get(global.VARS.CLEAN_ID(id)) || {})[ SORT_PROP ] || -1;
      }

      function __getBitrate(url, dur, callback, needFileSize, id) {

        if (cache.has(id)) {
          callback(cache.get(id), true);
          return 'gvik-bitrate';
        }

        global.VARS.GET_FILE_SIZE(url, function(size) {
          if (size) {
            return callback(__calcBitrate(size, dur, needFileSize, id));
          }
        });

        return CLASS_BITRATE;
      }

      global.VARS.GET_BITRATE = __getBitrate;

      function setBitrate(audioEl, callback) {

        audioEl.setAttribute(NAME_ATTR, true);

        var data = global.VARS.PARSE_AUDIO_DATA(audioEl);
        var bitrateEl = document.createElement('div');

        data.act.appendChild(bitrateEl);

        bitrateEl.className = __getBitrate(data.url, data.dur, function(res, fromCache) {

          if (fromCache) {
            //
          } else if (!LOADER_DISABLED) {
            bitrateEl.classList.remove('loader');
          }

          bitrateEl.innerText = res.formated;

          res.url = data.url;
          res.dur = data.dur;
          res.id = data.id;

          if (!cache.has(data.id)) {
            cache.set(data.id, res);
          }
          callback && callback(bitrateEl, res, audioEl);

        }, FILE_SIZE_ENABLED, data.id);

      }

      CONFS.get('auto-load-bit') &&
          events.bind([
              'audio.newRows',
              'audio',
              'padOpen'
            ], function(data, evaname) {

              var fromPad = data ? !!(data.el || data[ 0 ][ 0 ]) : false;

              var audios = dom.queryAll(AUDIO_SELECTOR);
              var l = audios.length;

              if (!fromPad) {
                if (!l) {
                  autoLoadBitFn && autoLoadBitFn(false);
                }
              }
              for (var i = 0; i<l; i++) {
                setBitrate(audios[ i ], fromPad ? null : autoLoadBitFn);
              }
            }, true);

      var BIT_SELECTORS = core.map([
          '',
          '.play_new',
          '.gvik-download'
        ], function(val) {
          return (AUDIO_SELECTOR + ' ' + val).trim();
        });

      if (CONFS.get('bitrate-audio')) {
        var BIT_SELECTOR = BIT_SELECTORS[ 0 ];
      } else if (CONFS.get('bitrate-playBtn')) {
        BIT_SELECTOR = BIT_SELECTORS[ 1 ];

      }else if (CONFS.get('bitrate-downloadBtn')) {
        BIT_SELECTOR = BIT_SELECTORS[ 2 ];
      }

      dom.setDelegate(document, BIT_SELECTOR, 'mouseover', function(el, e) {

        if (!dom.is(el, AUDIO_SELECTOR)) {
          el = dom.parent(e, AUDIO_SELECTOR);
        }
        setBitrate(el);
      });

    });
