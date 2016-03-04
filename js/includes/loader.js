/**
 *
 *
 *
 *
 */

<<<<<<< HEAD
GViK( function( appData, require ) {

  'use strict';
  var core = require( 'core' );
  var events = require( 'events' );
  var options = require( 'options' );
  var constants = require( 'constants' );
  var chrome = require( 'chrome' );
  var dom = require( 'dom' );

  var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/;
  var rPlugin = /\/([^\/]+)\.js$/;

  constants.define( 'ID', window.vk.id );

  chrome
    .pushID()
    .ga( 'send', 'event', 'vk', 'init' )

  .local.get( {
    key: 'options'
  }, function( res ) {

    options.load( res.options );


    if ( options.get( 'system', 'enable-qicksett' ) ) {
      events.bind( 'changeURL', function() {
        chrome.sendRequest( 'showPageAction', {} );
      }, true );
    }

    core.define( core.filter( appData.JS_LIST, function( curFileName ) {

      var pluginName = curFileName.match( rNamespacePlugin ) ||
        curFileName.match( rPlugin );

      if ( !pluginName ) {
        return true;
      }
      return !( options.get( pluginName.pop(), 'enable' ) === false );
    } ), {
      suffix: appData.VERSION,
      path: appData.APP_PATH,
    }, function() {
      require( 'events' ).trigger( 'gvik.loaded' );
    } );
  } );
=======
GViK(function(appData, require) {

        'use strict';
  var core = require('core');
  var events = require('events');
  var options = require('options');
  var constants = require('constants');
  var chrome = require('chrome');
  var dom = require('dom');

  var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/;
  var rPlugin = /\/([^\/]+)\.js$/;

  constants.define('ID', window.vk.id);

  chrome
      .pushID()
      .ga('send', 'event', 'vk', 'init')

      .local.get({
        key: 'options'
      }, function(res) {

        options.load(res.options);


        if (options.get('system', 'enable-qicksett')) {
          events.bind('changeURL', function() {
            chrome.sendRequest('showPageAction', {});
          }, true);
        }

        core.define(core.filter(appData.JS_LIST, function(curFileName) {

          var pluginName = curFileName.match(rNamespacePlugin) ||
               curFileName.match(rPlugin);

          if (!pluginName) {
            return true;
          }
          return !(options.get(pluginName.pop(), 'enable') === false);
        }), {
          suffix: appData.VERSION,
          path: appData.APP_PATH,
        });
      });
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

});
