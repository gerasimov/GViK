/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */



_GViK.Init( function( gvik, require ) {

  "use strict";

  var dom = require( 'dom' ),
    core = require( 'core' ),
    appPath = chrome.extension.getURL( '' ),

    rIsJs = /\.js$/,
    rIsIncludes = /^js\/includes\//;


  function __init( manifest ) {


    var includesJSList = [],
      engineJSList = [];

    core.each( manifest.web_accessible_resources, function( fileName ) {

      if ( !rIsJs.test( fileName ) )
        return;

      if ( rIsIncludes.test( fileName ) ) {
        includesJSList.push( fileName );
        return;
      }

      engineJSList.push( fileName );
    } );


    engineJSList.unshift( includesJSList.shift() );
    engineJSList.push( includesJSList.shift() );

    core.extend( sessionStorage, {
      apppath: appPath,
      appid: appPath.split( /\/+/ )[ 1 ],
      manifest: JSON.stringify( manifest ),
      jslist: JSON.stringify( includesJSList )
    } );


    core.define( engineJSList, {
      suffix: manifest.version,
      path: appPath
    }, function() {
      console.log( 'GViK init' );
    } );

  }

  if ( SUPPORT.runtime ) {
    __init( chrome.runtime.getManifest() );
  } else {
    core.getResource( 'manifest.json', function( res ) {
      __init( JSON.parse( res ) );
    } );
  }


} );