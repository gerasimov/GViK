/**
 *
 *
 *
 *
 *
 */

GViK({
  'audio': ['download-enable', 'add-but'],
}, function(gvik, require, Add) {

  'use strict';

  var core = require('core');
  var chrome = require('chrome');
  var dom = require('dom');
  var options = require('options');
  var events = require('events');
  var global = require('global');

  var CONFS = options.get('audio');

  var FROM_CACHE = CONFS.get('download-fromCache');
  var SAVE_AS = CONFS.get('download-saveAs');
  var rExtTest = /\.(?:\%e|mp3)$/;
  var fileNamePattern = CONFS.get('format-filename');
  var methodNameDownload = FROM_CACHE ? 'downloadFromCache' : 'download';

  function __formatFileName(data) {

    fileNamePattern = fileNamePattern.trim();

    var ext = '.' + data.ext;

    if (!rExtTest.test(fileNamePattern)) {
      fileNamePattern += ext;
    }

    var fName = core.tmpl2(fileNamePattern, {
      a: data.artist,
      t: data.title,
      e: data.ext,
      d: data.dur,
      i: data.id
    });

    fName = fName.replace(/[\\\/\:\*\?\"\<\>\|]+/gi, '').trim();

    if (fName.length === ext.length) {
      fName = data.artist + ' - ' + data.title + ext;
    }
    return fName;
  }

  function _download(data) {
    chrome.download[ methodNameDownload ]({
      url: data.url,
      filename: __formatFileName(data),
      saveAs: SAVE_AS
    }, function(downloadItemId) {
      chrome.download.search(downloadItemId, function(downloadItem) {
        events.trigger('AUDIO_downloaded', {
          downloadItem: downloadItem,
          data: data
        });
      });
    });
  }

  events.bind('audio.download', _download);

  dom.setDelegate(document,
        '.audio:not([id=audio_global]):not([data-gvik-download])',
            'mouseover', function(audioEl) {

              audioEl.setAttribute('data-gvik-download', true);

              var infoEl = dom.byClass('info', audioEl).item(0);
              var artistEl = dom.byTag('b', infoEl).item(0);
              var titleEl = artistEl.nextElementSibling;
              var data = global.VARS.PARSE_AUDIO_DATA(audioEl);
              data.artist = artistEl.innerText;
              data.title = titleEl.innerText;
              data.ext = 'mp3';

              var butEl = dom.create('div', {
                prop: {
                  'className': 'gvik-download'
                },
                events: {
                  click: function(e) {

                    e.stopPropagation();
                    e.preventDefault();

                    e._canceled = true;

                    _download(data);
                  }
                }
              });

              data.act.appendChild(butEl);

              return data;

            });

});
