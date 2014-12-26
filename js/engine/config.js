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


    SQL_DATABASE_VERSION: "1.0",
    SQL_DATABASE_SHORTNAME: "GViK",
    SQL_DATABASE_NAME: "GViK",
    SQL_DATABASE_SIZE: ( 1024 * 1024 ) * 5,

    SIDEBAR_LASTFM_TOP_TRACKS_LIMIT: 150,



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