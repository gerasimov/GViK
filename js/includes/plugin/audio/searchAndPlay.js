/**
 *
 *
 *
 */

GViK( function( gvik, require, add ) {

  'use strict';

  var core = require( 'core' );
  var dom = require( 'dom' );
  var helpers = require( 'helpers' );
  var vkapi = require( 'vkapi' );

  var trackContainer = dom.create( 'div', {
    style: {
      display: 'none'
    }
  } );

  dom.append( document.body, trackContainer );

  add( 'searchandplay', function( searchData, callback, opt ) {

    vkapi.audioSearch( searchData, function( result ) {

      if ( !result ) {
        return;
      }

      var audioData = ( result.length != null ) ?
        result[ 0 ] :
        result;

      if ( !audioData ) {
        return;
      }

      var audio = audioData.audio || audioData;
      var audioHTML = helpers.DRAW_AUDIO( audio );

      trackContainer.innerHTML += audioHTML;

      callback( result );

      window.playAudioNew( audio.owner_id + '_' + audio.id );

    }, opt );

  }, true );

} );