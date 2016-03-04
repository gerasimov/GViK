/**





 */


GViK(function(gvik, require, Add) {

    var core = require('core'),
        _chrome = require('chrome'),
        options = require('options'),
        dom = require('dom');


    var tab = dom.byId('tab'),
        tabs = dom.queryAll('.tabs > ul li', tab),
        tabsCont = dom.queryAll('.tabs-cont > div', tab),
        lastID = sessionStorage._tabId || 0;

    dom.setData(tabsCont[lastID], 'id', lastID);

    function classManip(i, key, className) {

        var ctab = tabs[i],
            ctabcont = tabsCont[i];


        if (!ctab || !ctabcont) {
            return;
        }

        ctab.classList[key](className);
        ctabcont.classList[key](className);
    }


    function addEvent(el, ID) {
        dom.setEvent(el, 'click', function() {
            if (lastID === ID) {
                return;
            }

            classManip(lastID, 'remove', 'active');
            classManip(ID, 'add', 'active');

            sessionStorage._tabId = lastID = ID;
        });

        dom.setData(tabs[ID], 'id', ID);
    }

    core.each(tabs, addEvent);

    classManip(sessionStorage._tabId || 0, 'add', 'active');



});
