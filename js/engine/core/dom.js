/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( function( gvik, require, Add ) {

  "use strict";

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
        }
        break;
    }
    return element;
  }

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
        }
        break;
    }
    return element;
  }
  var eventsContainer = {},
    expando = 'gvik-' + Date.now(),
    elEvId = 1;

  function _addEvent( element, evId, evName ) {
    element.addEventListener( evName, function() {
      var _ev = eventsContainer[ evId ][ evName ],
        i = 0,
        l = _ev.length;
      for ( ; i < l; i++ ) {
        _ev[ i ].apply( this, arguments );
      }
    }, false );
    return element;
  }


  var customEventCont = {};
 

  function setEvent( element, evName, evVal ) {

    if ( arguments.length === 2 ) {

      core.each( evName, function( v, k ) {
        setEvent( element, k, v );
      } );

      return element;
    }

    var evId = element[ expando ];

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
    if ( evid )
      core.each( eventsContainer[ evid ][ eventName ], function( ev ) {
        ev.call( el );
      } );
  }

  function parents( pNode, selector ) {
    var ret = [];
    if ( pNode.path ) {
      var i = 0,
        l = pNode.path.length;
      for ( ; i < l; i++ )
        if ( pNode.path[ i ].webkitMatchesSelector && pNode.path[ i ].webkitMatchesSelector( selector ) )
          ret.push( pNode.path[ i ] );
    } else
      for ( ;
        ( pNode = pNode.parentNode ) && pNode.nodeType === 1; ) {
        if ( pNode.webkitMatchesSelector( selector ) ) {
          ret.push( pNode );
        }
      }

    return ret;
  }

  function parent( pNode, selector ) {
    if ( pNode.path ) {
      var i = 0,
        l = pNode.path.length;


      for ( ; i < l; i++ ) {
        if ( pNode.path[ i ].webkitMatchesSelector && pNode.path[ i ].webkitMatchesSelector( selector ) ) return pNode.path[ i ];
      }
    } else {
      for ( ;
        ( pNode = pNode.parentNode ) && pNode.nodeType === 1; ) {
        if ( pNode.webkitMatchesSelector( selector ) ) {
          return pNode;
        }
      }
    }
  }

  function empty( pNode ) {
    var child;
    while ( ( child = pNode.firstChild ) ) {
      if ( child[ expando ] ) {
        delete eventsContainer[ child[ expando ] ];
      }

      pNode.removeChild( child );
    }
  }

  function clone( element, cloneEvent ) {

    var cloneElement = element.cloneNode( true );

    if ( !cloneEvent )
      return cloneElement;

    var id = element[ expando ];

    if ( id === undefined )
      return cloneElement;

    cloneElement[ expando ] = id;

    core.each( Object.keys( eventsContainer[ id ] ), function( v ) {
      _addEvent( cloneElement, id, v );
    } );

    return cloneElement;
  }

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
          if ( ev._canceled )
            return;


          var curEl = ev.target || ev.srcElement,
            prnt = curEl.webkitMatchesSelector( selector ) ? curEl : parent( ev.path ? ev : curEl, selector );

          if ( prnt )
            return evFn.call( prnt, prnt, ev, curEl );
        } );
    }
    return parentEl;
  }

  function setData( element, datName, datVal ) {
    switch ( arguments.length ) {
      case 3:
        element.setAttribute( 'data-' + datName, datVal );
        break;
      case 2:
        if ( core.isPlainObject( datName ) )
          core.each( datName, function( v, k ) {
            element.setAttribute( 'data-' + k, v );
          } );

        break;
    }
    return element;
  }

  function setProp( element, propName, propVal ) {
    switch ( arguments.length ) {
      case 3:
        element[ propName ] = propVal;
        break;
      case 2:

        if ( core.isPlainObject( propName ) )
          core.each( propName, function( v, k ) {
            element[ k ] = v;
          } );

        break;
    }
    return element;
  }

  function append( element, arr ) {

    var i = 0,
      isarr = Array.isArray( arr ),
      arg = isarr ? arr : Array.prototype.slice.call( arguments, 1 ),
      l = arg.length;

    if ( l === 1 )
      return element.appendChild( arg[ 0 ] );
    else if ( l === 0 )
      return;

    var df = document.createDocumentFragment();

    for ( ; i < l; i++ )
      if ( arg[ i ] )
        df.appendChild( arg[ i ] );

    element.appendChild( df );
    return element;
  }



  var decoder = document.createElement( 'textarea' );

  function getToken( arr ) {
    var i = !arr.length ? '' : '(?!(' + arr.join( '|' ) + '))';
    return new RegExp( i + '\\&(?:[a-z]{2,7}|\\#x?[0-9a-z]{2,6})\\;', 'ig' );
  }

  function unes( str ) {
    var noSpecialChar = [],
      after,
      i = 0,
      token,
      l = 30;

    for ( ; i < l; i++ ) {
      token = getToken( noSpecialChar );

      if ( !token.test( str ) )
        break;

      str = str.replace( token, function( before ) {
        decoder.innerHTML = before;
        after = decoder.value;

        if ( before !== after )
          return after;

        noSpecialChar.push( before );
        return before;
      } );

    }
    return str;
  }

  function after( el, targ ) {
    var next,
      parentNode = el.parentNode;
    if ( ( next = el.nextElementSibling ) )
      parentNode.insertBefore( targ, next );
    else parentNode.appendChild( targ );
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

  function create( tagName, data ) {
    var element = document.createElement( tagName ),
      f, i;

    if ( data )
      for ( i in data ) {
        if ( ( f = assaciateFn[ i ] ) )
          f( element, data[ i ] );
      }
    return element;
  }

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
    create: create,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
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
  } );

} );