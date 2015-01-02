/**
 *
 *
 *
 *
 *
 *
 *
 */


_GViK( function( gvik, require, Add ) {


  var configs = {

    DEBUG: true,

    CHROME_RESPONSE: 'gvik-response',
    CHROME_REQUEST: 'gvik-call',
    CHROME_CSREQUEST: 'gvik-callCS',
    CHROME_REQUEST_SYNC: 'gvik-callSync',
    CHROME_DISCONNECT: 'gvik-disconnect',
    CHROME_CS_RESPONSE_NAME: 'gvik-result',

    CHROME_FORCE_CS_RUN: true,

    CACHE_CLEAR_TIMEOUT: 10 * ( 60 * 1000 ),

    SQL_DATABASE_VERSION: "1.0",
    SQL_DATABASE_SHORTNAME: "GViK",
    SQL_DATABASE_NAME: "GViK",
    SQL_DATABASE_SIZE: 5 * ( 1024 * 1024 ),

    SIDEBAR_LASTFM_TOP_TRACKS_LIMIT: 20,


    CORE_PATH: "engine/core/",




    LOADER_TIMEOUT: 1000

  };



  Add( 'config', {
    get: function( key ) {
      return configs[ key ];
    },

    get config() {
      return configs;
    }
  } );

} );