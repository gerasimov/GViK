/**
 *
 *
 *
 *
 *
 *
 *
 */


_GViK.Init( function() {


  var configs = {

    DEBUG: true,

    CHROME_RESPONSE: 'gvik-response',
    CHROME_REQUEST: 'gvik-call',
    CHROME_CSREQUEST: 'gvik-callCS',
    CHROME_REQUEST_SYNC: 'gvik-callSync',
    CHROME_DISCONNECT: 'gvik-disconnect',
    CHROME_CS_RESPONSE_NAME: 'gvik-result',

    CHROME_FORCE_CS_RUN:  true,


    SIDEBAR_LASTFM_TOP_TRACKS_LIMIT: 150,



    LOADER_TIMEOUT: 1000

  };



  _GViK.Add( 'config', {
    get: function( key ) {
      return configs[ key ];
    },

    get config() {
      return configs;
    }
  } );

} );