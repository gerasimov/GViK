/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

<<<<<<< HEAD
GViK( function( gvik, require, Add ) {

  'use strict';

  var core = require( 'core' );

  function setAttr( element, attName, attVal ) {
    switch ( arguments.length ) {
      case 3:
        element.setAttribute( attName, attVal );
        break;
      case 2:
        if ( core.isPlainObject( attName ) ) {
          core.each( attName, function( v, k ) {
            element.setAttribute( k, v );
          } );
=======
GViK(function(gvik, require, Add) {

  'use strict';

  var core = require('core');

  function setAttr(element, attName, attVal) {
    switch (arguments.length) {
      case 3:
        element.setAttribute(attName, attVal);
        break;
      case 2:
        if (core.isPlainObject(attName)) {
          core.each(attName, function(v, k) {
            element.setAttribute(k, v);
          });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }
        break;
    }
    return element;
  }

<<<<<<< HEAD
  function setStyle( element, stName, stVal ) {
    var style = element.style;
    switch ( arguments.length ) {
      case 3:
        style.setProperty( stName, stVal );
        break;
      case 2:
        if ( core.isPlainObject( stName ) ) {
          core.each( stName, function( v, k ) {
            style.setProperty( k, v );
          } );
=======
  function setStyle(element, stName, stVal) {
    var style = element.style;
    switch (arguments.length) {
      case 3:
        style.setProperty(stName, stVal);
        break;
      case 2:
        if (core.isPlainObject(stName)) {
          core.each(stName, function(v, k) {
            style.setProperty(k, v);
          });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }
        break;
    }
    return element;
  }

  var eventsContainer = {};
  var expando = 'gvik-' + Date.now();
  var elEvId = 1;

<<<<<<< HEAD
  function _addEvent( element, evId, evName ) {
    element.addEventListener( evName, function() {
=======
  function _addEvent(element, evId, evName) {
    element.addEventListener(evName, function() {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

      var _ev = eventsContainer[ evId ][ evName ];
      var l = _ev.length;
      var i = 0;
      var lr;

<<<<<<< HEAD
      for ( ; i < l; i++ ) {
        lr = _ev[ i ].apply( this, arguments );
      }
      return lr;

    }, false );
    return element;
  }

  function setEvent( element, evName, evVal ) {

    if ( arguments.length === 2 ) {
      core.each( evName, function( v, k ) {
        setEvent( element, k, v );
      } );
=======
      for (; i < l; i++) {
        lr = _ev[ i ].apply(this, arguments);
      }
      return lr;

    }, false);
    return element;
  }

  function setEvent(element, evName, evVal) {

    if (arguments.length === 2) {
      core.each(evName, function(v, k) {
        setEvent(element, k, v);
      });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      return element;
    }

    var evId = element[ expando ];

<<<<<<< HEAD
    if ( !evId ) {
      element[ expando ] = ( evId = elEvId++ );
      eventsContainer[ evId ] = {};
    }

    if ( eventsContainer[ evId ][ evName ] === undefined ) {
      eventsContainer[ evId ][ evName ] = [];
      _addEvent( element, evId, evName );
    }

    eventsContainer[ evId ][ evName ].push( evVal );
    return element;
  }

  function trigger( el, eventName ) {
    var evid = el[ expando ];
    if ( evid ) {
      core.each( eventsContainer[ evid ][ eventName ], function( ev ) {
        ev.call( el );
      } );
    }
  }

  function parents( pNode, selector ) {
    var ret = [];

    if ( pNode.path ) {
      var i = 0;
      var l = pNode.path.length;

      for ( ; i < l; i++ ) {
        if ( pNode.path[ i ].webkitMatchesSelector &&
          pNode.path[ i ].webkitMatchesSelector( selector ) ) {
          ret.push( pNode.path[ i ] );
        }
      }
    } else {
      while ( ( pNode = pNode.parentNode ) && pNode.nodeType === 1 ) {
        if ( pNode.webkitMatchesSelector( selector ) ) {
          ret.push( pNode );
=======
    if (!evId) {
      element[ expando ] = (evId = elEvId++);
      eventsContainer[ evId ] = {};
    }

    if (eventsContainer[ evId ][ evName ] === undefined) {
      eventsContainer[ evId ][ evName ] = [];
      _addEvent(element, evId, evName);
    }

    eventsContainer[ evId ][ evName ].push(evVal);
    return element;
  }

  function trigger(el, eventName) {
    var evid = el[ expando ];
    if (evid) {
      core.each(eventsContainer[ evid ][ eventName ], function(ev) {
        ev.call(el);
      });
    }
  }

  function parents(pNode, selector) {
    var ret = [];

    if (pNode.path) {
      var i = 0;
      var l = pNode.path.length;

      for (; i < l; i++) {
        if (pNode.path[ i ].webkitMatchesSelector &&
            pNode.path[ i ].webkitMatchesSelector(selector)) {
          ret.push(pNode.path[ i ]);
        }
      }
    } else {
      while ((pNode = pNode.parentNode) && pNode.nodeType === 1) {
        if (pNode.webkitMatchesSelector(selector)) {
          ret.push(pNode);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }
      }
    }
    return ret;
  }

<<<<<<< HEAD
  function parent( pNode, selector ) {
    if ( pNode.path ) {
      var i = 0;
      var l = pNode.path.length;

      for ( ; i < l; i++ ) {
        if ( pNode.path[ i ].webkitMatchesSelector &&
          pNode.path[ i ].webkitMatchesSelector( selector ) ) {
=======
  function parent(pNode, selector) {
    if (pNode.path) {
      var i = 0;
      var l = pNode.path.length;

      for (; i < l; i++) {
        if (pNode.path[ i ].webkitMatchesSelector &&
            pNode.path[ i ].webkitMatchesSelector(selector)) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
          return pNode.path[ i ];
        }
      }
    } else {
<<<<<<< HEAD
      while ( ( pNode = pNode.parentNode ) && pNode.nodeType === 1 ) {
        if ( pNode.webkitMatchesSelector( selector ) ) {
=======
      while ((pNode = pNode.parentNode) && pNode.nodeType === 1) {
        if (pNode.webkitMatchesSelector(selector)) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
          return pNode;
        }
      }
    }

  }

<<<<<<< HEAD
  function empty( pNode ) {
    var child;
    while ( ( child = pNode.firstChild ) ) {

      if ( child[ expando ] ) {
        delete eventsContainer[ child[ expando ] ];
      }
      pNode.removeChild( child );
    }
  }

  function remove( element ) {
    if ( element.parentNode ) {
      element.parentNode.removeChild( element );
    }
  }

  function clone( element, cloneEvent ) {

    var cloneElement = element.cloneNode( true );

    if ( !cloneEvent ) {
=======
  function empty(pNode) {
    var child;
    while ((child = pNode.firstChild)) {

      if (child[ expando ]) {
        delete eventsContainer[ child[ expando ] ];
      }
      pNode.removeChild(child);
    }
  }

  function clone(element, cloneEvent) {

    var cloneElement = element.cloneNode(true);

    if (!cloneEvent) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      return cloneElement;
    }
    var id = element[ expando ];

<<<<<<< HEAD
    if ( id === undefined ) {
=======
    if (id === undefined) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      return cloneElement;
    }

    cloneElement[ expando ] = id;

<<<<<<< HEAD
    core.each( Object.keys( eventsContainer[ id ] ), function( v ) {
      _addEvent( cloneElement, id, v );
    } );
=======
    core.each(Object.keys(eventsContainer[ id ]), function(v) {
      _addEvent(cloneElement, id, v);
    });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    return cloneElement;
  }

<<<<<<< HEAD
  function setDelegate( parentEl, selector, evName, evFn ) {
    switch ( arguments.length ) {
      case 2:
        core.each( selector, function( v, k ) {
          core.each( v, function( ev, evn ) {
            setDelegate( parentEl, k, evn, ev );
          } );
        } );
        break;
      case 3:
        core.each( evName, function( v, k ) {
          setDelegate( parentEl, selector, k, v );
        } );
        break;
      case 4:
        if ( Array.isArray( evName ) ) {
          return core.each( evName, function( ev ) {
            setDelegate( parentEl, selector, ev, evFn );
          } );
        }
        setEvent( parentEl, evName, function( ev ) {

          if ( ev._canceled ) {
=======
  function setDelegate(parentEl, selector, evName, evFn) {
    switch (arguments.length) {
      case 2:
        core.each(selector, function(v, k) {
          core.each(v, function(ev, evn) {
            setDelegate(parentEl, k, evn, ev);
          });
        });
        break;
      case 3:
        core.each(evName, function(v, k) {
          setDelegate(parentEl, selector, k, v);
        });
        break;
      case 4:
        if (Array.isArray(evName)) {
          return core.each(evName, function(ev) {
            setDelegate(parentEl, selector, ev, evFn);
          });
        }
        setEvent(parentEl, evName, function(ev) {

          if (ev._canceled) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
            return false;
          }

          var curEl = ev.target || ev.srcElement;
<<<<<<< HEAD
          var prnt = curEl.webkitMatchesSelector( selector ) ?
            curEl :
            parent( ev, selector );

          if ( prnt ) {
            return evFn.call( prnt, prnt, ev, curEl );
          }
        } );
=======
          var prnt = curEl.webkitMatchesSelector(selector) ?
                      curEl :
                      parent(ev, selector);

          if (prnt) {
            return evFn.call(prnt, prnt, ev, curEl);
          }
        });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        break;
    }
    return parentEl;
  }

<<<<<<< HEAD
  function setData( element, datName, datVal ) {
    switch ( arguments.length ) {
      case 3:
        element.setAttribute( 'data-' + datName, datVal );
        break;
      case 2:
        if ( core.isPlainObject( datName ) ) {
          core.each( datName, function( v, k ) {
            element.setAttribute( 'data-' + k, v );
          } );
=======
  function setData(element, datName, datVal) {
    switch (arguments.length) {
      case 3:
        element.setAttribute('data-' + datName, datVal);
        break;
      case 2:
        if (core.isPlainObject(datName)) {
          core.each(datName, function(v, k) {
            element.setAttribute('data-' + k, v);
          });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }

        break;
    }
    return element;
  }

<<<<<<< HEAD
  function setProp( element, propName, propVal ) {
    switch ( arguments.length ) {
=======
  function setProp(element, propName, propVal) {
    switch (arguments.length) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      case 3:
        element[ propName ] = propVal;
        break;
      case 2:

<<<<<<< HEAD
        if ( core.isPlainObject( propName ) ) {
          core.each( propName, function( v, k ) {
            element[ k ] = v;
          } );
=======
        if (core.isPlainObject(propName)) {
          core.each(propName, function(v, k) {
            element[ k ] = v;
          });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }

        break;
    }
    return element;
  }

<<<<<<< HEAD
  function append( element, arr ) {

    var i = 0;
    var isarr = Array.isArray( arr );
    var arg = isarr ? arr : Array.prototype.slice.call( arguments, 1 );
    var l = arg.length;

    if ( l === 1 ) {
      return element.appendChild( arg[ 0 ] );
    } else if ( l === 0 ) {
=======
  function append(element, arr) {

    var i = 0;
    var isarr = Array.isArray(arr);
    var arg = isarr ? arr : Array.prototype.slice.call(arguments, 1);
    var l = arg.length;

    if (l === 1) {
      return element.appendChild(arg[ 0 ]);
    } else if (l === 0) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      return;
    }

    var df = document.createDocumentFragment();

<<<<<<< HEAD
    for ( ; i < l; i++ ) {
      if ( arg[ i ] ) {
        df.appendChild( arg[ i ] );
      }
    }
    element.appendChild( df );
    return element;
  }

  var decoder = document.createElement( 'textarea' );

  function getToken( arr ) {
    var i = !arr.length ? '' : '(?!(' + arr.join( '|' ) + '))';
    return new RegExp( i + '\\&(?:[a-z]{2,7}|\\#x?[0-9a-z]{2,6})\\;', 'ig' );
  }

  function unes( str ) {
=======
    for (; i < l; i++) {
      if (arg[ i ]) {
        df.appendChild(arg[ i ]);
      }
    }
    element.appendChild(df);
    return element;
  }

  var decoder = document.createElement('textarea');

  function getToken(arr) {
    var i = !arr.length ? '' : '(?!(' + arr.join('|') + '))';
    return new RegExp(i + '\\&(?:[a-z]{2,7}|\\#x?[0-9a-z]{2,6})\\;', 'ig');
  }

  function unes(str) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    var noSpecialChar = [];
    var after;
    var i = 0;
    var token;
    var l = 30;

<<<<<<< HEAD
    for ( ; i < l; i++ ) {
      token = getToken( noSpecialChar );

      if ( !token.test( str ) ) {
        break;
      }

      str = str.replace( token, function( before ) {
        decoder.innerHTML = before;
        after = decoder.value;

        if ( before !== after ) {
          return after;
        }

        noSpecialChar.push( before );
        return before;
      } );
=======
    for (; i < l; i++) {
      token = getToken(noSpecialChar);

      if (!token.test(str)) {
        break;
      }

      str = str.replace(token, function(before) {
        decoder.innerHTML = before;
        after = decoder.value;

        if (before !== after) {
          return after;
        }

        noSpecialChar.push(before);
        return before;
      });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    }
    return str;
  }

<<<<<<< HEAD
  function after( el, targ ) {
    var next;
    var parentNode = el.parentNode;
    if ( ( next = el.nextElementSibling ) ) {
      parentNode.insertBefore( targ, next );
    } else {
      parentNode.appendChild( targ );
=======
  function after(el, targ) {
    var next;
    var parentNode = el.parentNode;
    if ((next = el.nextElementSibling)) {
      parentNode.insertBefore(targ, next);
    } else {
      parentNode.appendChild(targ);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    }
  }

  var assaciateFn = {
    style: setStyle,
    attr: setAttr,
    delegate: setDelegate,
    data: setData,
    prop: setProp,
    append: append,
    events: setEvent
  };

<<<<<<< HEAD
  function create( tagName, data ) {

    var element = document.createElement( tagName );
    var f;
    var i;

    if ( data ) {
      for ( i in data ) {
        if ( ( f = assaciateFn[ i ] ) ) {
          f( element, data[ i ] );
=======
  function create(tagName, data) {

    var element = document.createElement(tagName);
    var f;
    var i;

    if (data) {
      for (i in data) {
        if ((f = assaciateFn[ i ])) {
          f(element, data[ i ]);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        }
      }
    }
    return element;
  }

<<<<<<< HEAD
  function addClass( el, clas ) {
    return clas.split( ' ' )
      .forEach( function( _className ) {
        el.classList.add( _className );
      } );
  }

  function hasClass( el, clas ) {
    return clas.split( ' ' )
      .map( function( _className ) {
        return el.classList.contains( _className );
      } )
      .every( function( hasclass ) {
        return hasclass;
      } );
  }

  function removeClass( el, clas ) {
    return clas.split( ' ' )
      .forEach( function( _className ) {
        el.classList.remove( _className );
      } );
  }

  function is( el, selector ) {
    return el.webkitMatchesSelector( selector );
  }

  function byId( id ) {
    return document.getElementById( id );
  }

  function byClass( klass, el ) {
    return ( el || document )
      .getElementsByClassName( klass );
  }

  function byTag( tagName, el ) {
    return ( el || document )
      .getElementsByTagName( tagName );
  }

  function query( selector, el ) {
    return ( el || document )
      .querySelector( selector );
  }

  function queryAll( selector, el ) {
    return ( el || document )
      .querySelectorAll( selector );
  }

  Add( 'dom', {
=======
  function addClass(el, clas) {
    return clas.split(' ')
      .forEach(function(_className) {
        el.classList.add(_className);
      });
  }

  function hasClass(el, clas) {
    return clas.split(' ')
      .map(function(_className) {
        return el.classList.contains(_className);
      })
      .every(function(hasclass) {
        return hasclass;
      });
  }

  function removeClass(el, clas) {
    return clas.split(' ')
      .forEach(function(_className) {
        el.classList.remove(_className);
      });
  }

  function is(el, selector) {
    return el.webkitMatchesSelector(selector);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function byClass(klass, el) {
    return (el || document)
    .getElementsByClassName(klass);
  }

  function byTag(tagName, el) {
    return (el || document)
    .getElementsByTagName(tagName);
  }

  function query(selector, el) {
    return (el || document)
    .querySelector(selector);
  }

  function queryAll(selector, el) {
    return (el || document)
    .querySelectorAll(selector);
  }

  Add('dom', {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    create: create,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
<<<<<<< HEAD
    remove: remove,
=======
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    parent: parent,
    parents: parents,
    setStyle: setStyle,
    setAttr: setAttr,
    setDelegate: setDelegate,
    setData: setData,
    is: is,
    setProp: setProp,
    append: append,
    setEvent: setEvent,
    clone: clone,
    unes: unes,
    trigger: trigger,
    after: after,
    empty: empty,
    byId: byId,
    byTag: byTag,
    byClass: byClass,
    query: query,
    queryAll: queryAll
<<<<<<< HEAD
  } );

} );
=======
  });

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
