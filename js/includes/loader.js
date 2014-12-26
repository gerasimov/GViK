/**
 *
 *
 *
 *
 */


_GViK( function( appData, require, d ) {

  var core = require( 'core' ),
    event = require( 'event' ),
    options = require( 'options' ),
    config = require( 'config' ),
    chrome = require( 'chrome' ),
    dom = require( 'dom' );

  appData.getID = function() {
    return window.vk.id;
  };


  var rNamespacePlugin = /js\/includes\/plugin\/([^\/]+)\/.+\.js$/,
    rPlugin = /\/([^\/]+)\.js$/;

  event.bind( 'init', function() {


    chrome.local.get( {
      key: 'options'
    }, function( res ) {

      options.load( res.options );

      core.define( appData.JS_LIST.filter( function( curFileName ) {
        var pluginName = curFileName.match( rNamespacePlugin ) || curFileName.match( rPlugin );
        if ( !pluginName )
          return true;
        if ( options.get( pluginName.pop(), 'enable' ) === false )
          return false;
        return true;
      } ), {
        suffix: appData.VERSION,
        path: appData.APP_PATH,
      } );
    } );
  } );


  function checkID() {
    chrome.pushID();
    if ( appData.getID() === 0 )
      setTimeout( checkID, config.get( "LOADER_TIMEOUT" ) );
    else event.asyncTrigger( 'init' );
  }

  if ( options.get( 'system', 'enable-qicksett' ) ) {
    event.bind( "changeURL", function() {
      chrome.sendRequest( "showPageAction", {} );
    }, true );
  }

  chrome.ga( 'send', 'event', 'vk', 'init' );

  event.bind( 'load', checkID );

} );