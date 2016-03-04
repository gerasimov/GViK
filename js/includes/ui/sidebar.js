/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */

GViK( function( gvik, require, Add ) {

  'use strict';

  var dom = require( 'dom' );
  var core = require( 'core' );
  var chrome = require( 'chrome' );
  var options = require( 'options' );
  var events = require( 'events' );

  function Sidebar() {
    this.pages = [];
    this.config = options.get( 'sidebar' );
    this.shown = false;

    var that = this;

    this.sidebarEl = dom.create( 'div', {
      prop: {
        id: 'gvik-sidebar',
        className: [ this.config.get( 'animation' ) ? 'anim' : '' ].join( ' ' )
      }
    } );

    this.switcher = dom.create( 'span', {
      prop: {
        'className': 'gvik-switcher'
      }
    } );

    this.additionalSwitcherCont = dom.create( 'div', {
      prop: {
        'className': 'gvik-add-switcher-cont'
      },

      style: {
        position: 'absolute',
        top: '60px'
      }
    } );

    this.wrap = dom.create( 'div', {
      prop: {
        id: 'gvik-wrap',
        className: 'style-scrollbar'
      }
    } );

    dom.append( document.body,
      dom.append( this.sidebarEl, [
        this.wrap,
        this.switcher,
        this.additionalSwitcherCont
      ] )
    );

    events.bind( 'resize', function( s ) {
      that.wrap.style[ 'max-height' ] = s.h + 'px';
    }, true );



    dom.setDelegate( this.sidebarEl, '.gvikLink', 'click', function() {

      var hrf = this.getAttribute( 'data-href' );

      if ( that.config.get( 'open-ajax' ) ) {
        return window.nav && window.nav.go( hrf );
      } else if ( that.config.get( 'open-newTab' ) ) {
        return chrome.tabs.open( hrf, {}, {
          orUpd: true
        } );
      } else if ( that.config.get( 'open-cur' ) ) {
        location.href = hrf;
      }
    } );

    dom.setEvent( this.switcher, 'click', this.toggle.bind( this ) );

  }

  Sidebar.prototype.addPage = function( callback ) {
    var sidebarPage = new SidebarPage( this );
    this.pages.push( sidebarPage );
    return sidebarPage.create( callback );
  };

  Sidebar.prototype.removePage = function() {};

  Sidebar.prototype.isShow = function() {
    return this.sidebarEl.classList.contains( 'show' );
  };

  Sidebar.prototype.show = function() {
    if ( !this.isShow() ) {
      this.sidebarEl.classList.add( 'show' );
      events.trigger( 'SIDEBAR_show', this );
    }
  };

  Sidebar.prototype.hide = function() {
    if ( this.isShow() ) {
      this.sidebarEl.classList.remove( 'show' );
      events.trigger( 'SIDEBAR_hide', this );
    }
  };

  Sidebar.prototype.toggle = function() {
    if ( this.isShow() ) {
      this.hide();
    } else {
      this.show();
    }
  };

  Sidebar.prototype.toggleSize = function() {
    this.sidebarEl.classList.toggle( 'large' );
  };

  function SidebarPage( sidebar ) {

    this.switcher = null;
    this.page = null;
    this.sidebar = sidebar;
    this.index = this.sidebar.pages.length;

    this.created = false;

  }

  SidebarPage.prototype.show = function() {
    events.trigger( 'SIDEBAR_open-tab', this );
    return this;

  };

  SidebarPage.prototype.showLoading = function() {
    dom.removeClass( this.page, 'loaded' );
    return this;

  };
  SidebarPage.prototype.hideLoading = function() {
    dom.addClass( this.page, 'loaded' );
    return this;

  };

  SidebarPage.prototype.setHtml = function( html ) {
    this.page.innerHTML = html;
    return this;
  };

  SidebarPage.prototype.create = function( callback ) {


    var heightTab = parseInt( window.getComputedStyle( this.sidebar.switcher )[ 'height' ] ) + 5;

    var offset = ( heightTab * 2 ) + ( this.sidebar.pages.length * heightTab );
    var that = this;

    this.page = dom.create( 'div', {
      prop: {
        'className': [ 'tabCont', ( this.sidebar.pages.length > 1 ? 'gvik-none' : '' ) ].join( ' ' )
      }
    } );

    this.switcher = dom.create( 'span', {
      prop: {
        className: [ 'gvik-switcher', 'additional', 'gvik-none' ].join( ' ' )
      },
      events: {
        mousedown: function() {
          events.trigger( 'SIDEBAR_open-tab', that );
        }
      }
    } );

    events.bind( 'SIDEBAR_open-tab', function( cntx ) {
      if ( that.index !== cntx.index ) {
        that.page.classList.add( 'gvik-none' );
      } else {
        that.page.classList.remove( 'gvik-none' );
      }
    } );


    if ( this.sidebar.pages.length === 1 ) {
      this.switcher.classList.add( 'gvik-none' );
    } else {
      core.each( this.sidebar.pages, function( page ) {
        page.switcher.classList.remove( 'gvik-none' );
      } );
    }


    this.sidebar.wrap.style.minHeight = this.page.minHeight = offset + 'px';

    dom.append( this.sidebar.wrap, this.page );
    dom.append( this.sidebar.additionalSwitcherCont, this.switcher );

    core.each( this.sidebar.pages, function( sidebarPage ) {
      sidebarPage.page.style.minHeight = offset + 'px';
    } );


    callback && callback( this );

    if ( that.sidebar.isShow() ) {
      events.trigger( 'SIDEBAR_show', this.sidebar );
    }


    return this
  }

  SidebarPage.prototype.remove = function() {
    /*  dom.remove( this.page );
      dom.remove( this.switcher );*/
    return this;

  };


  Add( 'sidebar', new Sidebar() );

} );