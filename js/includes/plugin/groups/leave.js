/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK({
  'groups': 'fast-exit'
}, function(gvik, require, add) {

  'use strict';

  var options = require('options');
  var dom = require('dom');
  var chrome = require('chrome');
  var vkapi = require('vkapi');
  var events = require('events');
  var core = require('core');

  vkapi.pushPermission('groups');

  events.bind('groups', function() {

    var el = dom.byId('groups_list_summary');

    if (!el) {
      return;
    }

    dom.append(el, [

            dom.create('span', {
              prop: {
                className: 'divider',
                innerText: '|'
              }
            }),

            dom.create('span', {
              append: dom.create('a', {
                prop: {
                  innerText: 'Выйти из всех групп'
                },

                events: {
                  click: function() {
                    var key = 'gvik';

                    if ((prompt('Введите слово "' + key +
                                '", чтобы подтвердить действие.') || '')
                        .toLowerCase().trim() === key) {
                      vkapi.call('execute.allGroupsLeave');
                    }
                  }
                }
              })
            })
        ]);

  }, true);

  dom.setDelegate(document,
    '.group_list_row:not([data-gvik])', 'mouseover', function(el) {

      el.setAttribute('data-gvik', 'true');

      var child;
      var infRow;
      var but;

      if (!(infRow = el.querySelector('.group_row_info'))) {
        return;
      }

      dom.after(infRow, dom.create('span', {
      prop: {
        className: 'gvik-exit-group'
      },
      events: {
        click: function() {
          vkapi.call('execute.groupLeave', {
            gid: (/\d+/.exec(el.id)[ 0 ])
          }, function() {
            el.parentNode.removeChild(el);
          });
        }
      }
    }));

    });

});
