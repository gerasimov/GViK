/*
 
 */


GViK( {}, [], function( appData, require, add ) {


  "use strict";

  var core = require( 'core' );
  var dom = require( 'dom' );
  var chrome = require( 'chrome' );
  var events = require( 'events' );

  function Page( pager ) {

    this.el = dom.create( 'div', {
      prop: {
        className: 'gvik-pager__page'
      },
      data: {
        index: pager.count
      }
    } );

    this.elItem = dom.create( 'li', {
      append: this.el
    } );

    dom.append( pager.pageCont, this.elItem );
  }

  Page.prototype.setHTML = function( html ) {

    if ( typeof html == 'string' ) {
      this.el.innerHTML = html;
    } else {
      dom.append( this.el, html );
    }
  };



  Page.prototype.loadState = function( loaded ) {

  };



  function Pager() {

    this.pageCont = dom.create( 'ul' );
    this.el = dom.create( 'div', {
      append: this.pageCont,
      prop: {
        className: 'gvik-pager'
      },
      style: {
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'top': 0,
        'background-color': 'hsla(210, 27%, 91%, 0.83)',
        'left': 0,
        'z-index': 800,
      }
    } );

    dom.append( document.body, this.el );

    this.count = 0;
    this.pages = {};
  }


  Pager.prototype.show = function() {
    dom.addClass( this.el, '_show' );
  };

  Pager.prototype.hide = function() {
    dom.removeClass( this.el, '_show' );
  };

  Pager.prototype.createPage = function() {
    this.count++;

    var page = new Page( this );

    this.pages[ this.count ] = page;

    return page;
  };


  //add( 'pager', new Pager );

} );