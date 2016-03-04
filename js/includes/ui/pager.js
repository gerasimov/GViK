/*
<<<<<<< HEAD
 
 */


GViK( {}, [], function( appData, require, add ) {


  "use strict";

  var core = require( 'core' );
  var dom = require( 'dom' );
  var chrome = require( 'chrome' );
  var events = require( 'events' );

  function Page( pager ) {

    this.el = dom.create( 'div', {
=======

*/


GViK({}, [], function( appData, require, add ) {


  "use strict";

  var core = require('core');
  var dom = require('dom');
  var chrome = require('chrome');
  var events = require('events');

  function Page( pager ){
    
    this.el = dom.create('div', {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      prop: {
        className: 'gvik-pager__page'
      },
      data: {
        index: pager.count
      }
<<<<<<< HEAD
    } );

    this.elItem = dom.create( 'li', {
      append: this.el
    } );

    dom.append( pager.pageCont, this.elItem );
  }

  Page.prototype.setHTML = function( html ) {

    if ( typeof html == 'string' ) {
=======
    });
    
    this.elItem = dom.create('li', {
      append: this.el
    });

    dom.append(pager.pageCont, this.elItem);
  }

  Page.prototype.setHTML = function(html) {
    
    if(typeof html == 'string') {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      this.el.innerHTML = html;
    } else {
      dom.append( this.el, html );
    }
  };



  Page.prototype.loadState = function( loaded ) {
<<<<<<< HEAD

=======
    
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
  };



<<<<<<< HEAD
  function Pager() {

    this.pageCont = dom.create( 'ul' );
    this.el = dom.create( 'div', {
=======
  function Pager(){
    
    this.pageCont = dom.create('ul');
    this.el = dom.create('div', {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
      append: this.pageCont,
      prop: {
        className: 'gvik-pager'
      },
      style: {
<<<<<<< HEAD
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
=======
            'width': '100%',
            'height': '100%',
            'position': 'fixed',
            'top': 0,
            'background-color': 'hsla(210, 27%, 91%, 0.83)',
            'left': 0,
            'z-index': 800,
      }
    });

    dom.append(document.body, this.el);
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    this.count = 0;
    this.pages = {};
  }


  Pager.prototype.show = function() {
<<<<<<< HEAD
    dom.addClass( this.el, '_show' );
  };

  Pager.prototype.hide = function() {
    dom.removeClass( this.el, '_show' );
  };

  Pager.prototype.createPage = function() {
=======
    dom.addClass(this.el, '_show');
  };

  Pager.prototype.hide = function() {
    dom.removeClass(this.el, '_show');
  };

  Pager.prototype.createPage = function(  ) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
    this.count++;

    var page = new Page( this );

<<<<<<< HEAD
    this.pages[ this.count ] = page;
=======
    this.pages[this.count] = page;
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    return page;
  };


<<<<<<< HEAD
  //add( 'pager', new Pager );

} );
=======
 // add('pager', new Pager);

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
