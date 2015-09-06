/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK(function(gvik, require, Add) {

  'use strict';

  var dom = require('dom');
  var core = require('core');
  var chrome = require('chrome');
  var options = require('options');
  var events = require('events');

  var _shown = false;
  var cnfg = options.get('sidebar');

  var anim = cnfg.get('animation') ? 'anim' : '';

  var classSidebar = [anim].join(' ');

  var sidebarEl = dom.create('div', {
    prop: {
      id: 'gvik-sidebar',
      className: classSidebar
    }
  });

  var switcher = dom.create('span', {
    prop: {
      'className': 'gvik-switcher'
    }
  });

  var additionalSwitcherCont = dom.create('div', {
    prop: {
      'className': 'gvik-add-switcher-cont'
    },

    style: {
      position: 'absolute',
      top: '60px'
    }
  });

  var wrap = dom.create('div', {
    prop: {
      id: 'gvik-wrap',
      className: 'style-scrollbar'
    }
  });

  dom.append(document.body,
      dom.append(sidebarEl, [
          wrap,
          switcher,
          additionalSwitcherCont
      ])
  );

  events.bind('resize', function(s) {
    wrap.style[ 'max-height' ] = s.h + 'px';
  }, true);

  var ontogglestate = function() {
    events.trigger(_shown ? 'SIDEBAR_show' : 'SIDEBAR_hide');
  };

  var tabs = [];

  var sidebar = {
    get shown() {
      return _shown;
    },
    set shown(state) {
      if (typeof state !== 'boolean' || _shown === state) {
        return;
      }

      if ((_shown = state)) {
        sidebarEl.classList.add('show');
      } else {
        sidebarEl.classList.remove('show');
      }

      if (anim) {
        setTimeout(ontogglestate, 100);
      } else {
        ontogglestate();
      }
    }
  };

  sidebar.show = function() {
    this.shown = true;
  };

  sidebar.hide = function() {
    this.shown = false;
  };

  sidebar.toggle = function() {
    this.shown = !this.shown;
  };

  sidebar.toggleSize = function() {
    sidebarEl.classList.toggle('large');
  };

  var countPage = sidebar.countPage = 0;
  var heightTab = parseInt(window.getComputedStyle(switcher)[ 'height' ]) + 5;
  var lastTabC;

  sidebar.addPage = function(callback) {

    countPage += 1;

    var offset = (heightTab * 2) + (countPage * heightTab);

    var nTabCont = dom.create('div', {
      prop: {
        'className': ['tabCont', (countPage > 1 ? 'gvik-none' : '')].join(' ')
      }
    });

    var nSwitcher = dom.create('span', {
      prop: {
        className: ['gvik-switcher', 'additional', 'gvik-none'].join(' ')
      },
      events: {
        mousedown: function() {
          lastTabC.classList.add('gvik-none');
          nTabCont.classList.remove('gvik-none');
          lastTabC = nTabCont;
        }
      }
    });

    tabs.push(nSwitcher);

    if (!lastTabC) {
      lastTabC = nTabCont;
    }
    if (countPage === 1) {
      nSwitcher.classList.add('gvik-none');
    } else {
      core.each(tabs, function(el) {
        el.classList.remove('gvik-none');
      });
    }

    callback && callback(nSwitcher, nTabCont, wrap, countPage, function() {
      lastTabC.classList.add('gvik-none');
      nTabCont.classList.remove('gvik-none');
      lastTabC = nTabCont;
    });

    wrap.style.minHeight = nTabCont.minHeight = offset + 'px';

    additionalSwitcherCont.appendChild(nSwitcher);
    wrap.appendChild(nTabCont);

    core.each(wrap.children, function(el) {
      el.style.minHeight = offset + 'px';
    });

    return {
      switcher: nSwitcher,
      tabCont: nTabCont,
      wrap: wrap,
      countPage: countPage,
      show: function() {
        lastTabC.classList.add('gvik-none');
        nTabCont.classList.remove('gvik-none');
        lastTabC = nTabCont;
      }
    };
  };

  dom.setDelegate(sidebarEl, '.gvikLink', 'click', function() {

    var hrf = this.getAttribute('data-href');

    if (cnfg.get('open-ajax')) {
      return window.nav && window.nav.go(hrf);
    } else if (cnfg.get('open-newTab')) {
      return chrome.tabs.open(hrf, {}, {
        orUpd: true
      });
    } else if (cnfg.get('open-cur')) {
      location.href = hrf;
    }
  });

  dom.setEvent(switcher, 'click', sidebar.toggle.bind(sidebar));

  Add('sidebar', sidebar);

});
