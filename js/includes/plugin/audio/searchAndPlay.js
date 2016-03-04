/**
 *
 *
 *
 */

<<<<<<< HEAD
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
=======
GViK(function(gvik, require, add) {

  'use strict';

  var core = require('core');
  var dom = require('dom');
  var global = require('global');
  var search = require('search');

  var trackContainer = dom.create('div', {
    style: {
      display: 'none'
    }
  });

  dom.append(document.body, trackContainer);

  add('searchandplay', function(searchData, callback, opt) {

    require('vkapi').audioSearch(searchData, function(result) {

      if (!result) {
        return;
      }

      var audioData = (result.length != null) ?
          result[ 0 ] :
          result;

      if (!audioData) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
        return;
      }

      var audio = audioData.audio || audioData;
<<<<<<< HEAD
      var audioHTML = helpers.DRAW_AUDIO( audio );

      trackContainer.innerHTML += audioHTML;

      callback( result );

      window.playAudioNew( audio.owner_id + '_' + audio.id );

    }, opt );

  }, true );

} );
=======
      var audioHTML = global.VARS.DRAW_AUDIO(audio);

      trackContainer.innerHTML += audioHTML;

      callback(result);

      window.playAudioNew(audio.owner_id + '_' + audio.id);

    }, opt);

  }, true);

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
