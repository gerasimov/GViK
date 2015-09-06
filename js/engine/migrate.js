/**
 *
 *
 *
 */

(window.GViK == null) && 
(function(win) {

  'use strict';

  var _modules = {};

  function _add(name, fn, nocallfn) {
    _modules[ name.toLowerCase() ] = (typeof fn === 'function' && !nocallfn) ?
        fn.call(win, win) :
        fn;
  };

  win.GViK = function GViK() {

    var i = 0;
    var al = arguments.length;
    var fn;


    for(; i < al; i++) {

      if(typeof (fn = arguments[i]) !== 'function') {
        continue;
      }

      fn.call(win, win, function(module) {
          return _modules[ module.toLowerCase() ];
      }, function(key, fn, nocallfn) {

        switch (arguments.length) {
            case 1:
              for (var i in key) {
                  _add(i, key[ i ], fn);
              }
              break;
            case 2:
              _add(key, fn, nocallfn);
              break;
            default:
              break;
          }
      }); 

    }
  }
})
.call(null, window); 