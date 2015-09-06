/*




 */

GViK({}, ['sidebar'], function(appData, require, Add) {

  var events = require('events');
  var dom = require('dom');
  var global = require('global');
  var core = require('core');
  var sidebar = require('sidebar');
  var playlist = [];
  var disableTracks = [];
  var tempCont = {};

  var render = {
    TMPL: '<li>\
            <div>\
              <div>\
                <span>{{index}}</span>\
                <a>{{artist}}</a>\
                <span> - {{title}}</span>\
              </div>\
              <div></div>\
            </div>\
          </li>'
  };

  var page = sidebar.addPage();

  function drawSidebar() {
    page.tabCont.innerHTML = '<ul>' + core.map(playlist, function(id, i) {

      var track = window.audioPlayer.songInfos[ id ];

      return core.template(render.TMPL, /\{\{\w+\}\}/gi, [2, -2], {
        artist: track[ 5 ],
        title: track[ 6 ],
        index: (i + 1) + '. '
      });

    }).join('') + '</ul>';

    page.show();
    sidebar.show();
  }

  events.bind('playerOpen', function(data, evename, $scope) {

    core.decorator('audioPlayer.operate', function(a) {

      if ($scope.lastId === a[ 0 ]) {
        return;
      }

      if (disableTracks.indexOf(a[ 0 ]) >= 0) {

        a.__disabled = true;
        return a;
      }

      if (!playlist.length) {
        return;
      }

      a[ 0 ] = playlist.shift();

      drawSidebar();

      return a;
    }, true);

  }).bind('audio.globalStart', function() {
    if (!core.isEmpty(tempCont)) {
      core.extend(window.audioPlayer.songInfos, tempCont);
    }
  });


  dom.addClass(page.tabCont, 'loaded');

  var contextMenu = require('ContextMenu')('.audio').init();

  contextMenu.addItem({
    label: 'Добавить в очередь',
    clb: function(el) {
    var id = global.VARS.CLEAN_ID(el.id);

    if (window.audioPlayer) {
      window.audioPlayer.songInfos[ id ] = global.VARS.PARSE_AUDIO(el);
    } else {
      tempCont[ id ] = global.VARS.PARSE_AUDIO(el);
    }

    playlist.push(id);

    drawSidebar();
  }});

  contextMenu.addItem({
    label: 'Не воспроизводить',
    clb: function(el) {

    var id = global.VARS.CLEAN_ID(el.id);

    if (disableTracks.indexOf(id) == -1) {
      disableTracks.push(id);

      dom.addClass(el, 'disable');
      dom.addClass(dom.byClass('area', el).item(0), 'deleted');

    }
  }});

});
