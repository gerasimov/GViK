/*
 
 
 
 
 */

GViK( function( appData, require, Add ) {

  var events = require( 'events' );
  var dom = require( 'dom' );
  var helpers = require( 'helpers' );
  var core = require( 'core' );
  var inited = {};

  function ContextMenu( selector ) {

    this.selector = selector;
    this.clbs = [];

  }

  ContextMenu.prototype.init = function( cont ) {

    var $this = this;

    if ( inited[ this.selector ] ) {
      return this;
    }

    this.cm = dom.create( 'div', {
      prop: {
        className: 'gvik-contextmenu'
      },
      append: ( this.ul = dom.create( 'ul' ) ),

      events: {
        contextmenu: function( e ) {
          e.stopPropagation();
          e.preventDefault();
          e._canceled = true;

          $this.hide();
        },

        mouseleave: function() {
          $this.hide();
        },

      }
    } );

    cont = cont || document.body;

    dom.append( cont, this.cm );

    dom.setDelegate( cont, this.selector, 'contextmenu', function( el, e ) {

      if ( !$this.show() ) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      e._canceled = true;

      $this.el = el;

      $this.setPos( e );

      return false;

    } );

    dom.setDelegate( this.ul, 'li[data-id]', 'click', function( el, e ) {

      e.stopPropagation();
      e.preventDefault();

      var id = el.getAttribute( 'data-id' );

      $this.hide();

      if ( !id || !$this.clbs[ id ] ) {
        return;
      }

      $this.clbs[ id ].call( el, $this.el );

      $this.el = null;

    } );

    return this;
  };

  ContextMenu.prototype.hide = function() {
    dom.setStyle( this.cm, {
      display: 'none',
      left: 0,
      top: 0
    } );

    return this;

  };

  ContextMenu.prototype.show = function() {
    if ( this.clbs.length ) {
      dom.setStyle( this.cm, {
        display: 'block'
      } );
      return true;
    }
  };

  ContextMenu.prototype.addItem = function( item ) {
    if ( Array.isArray( item ) ) {
      return core.each( item, this.addItem.bind( this ) );
    }

    dom.append( this.ul, dom.create( 'li', {
      append: dom.create( 'a', {
        prop: {
          innerHTML: item.label
        }
      } ),
      data: {
        id: ( this.clbs.push( item.clb ) - 1 )
      }
    } ) );
    return this;
  };

  ContextMenu.prototype.setPos = function( e ) {
    dom.setStyle( this.cm, {
      top: ( ( e.y + document.body.scrollTop ) - 10 ) + 'px',
      left: ( ( e.x - 10 ) + 'px' )
    } );
    return this;
  };

  Add( 'ContextMenu', function( selector ) {
    return new ContextMenu( selector );
  }, true );

} );