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


    var __constants = {

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


        GOOGLE_ANALITICS_CODE: 'UA-51509924-1',


        VKAPI_APP_ID: 2224353,
        VKAPI_KEY_STORAGE: "vk",
        VKAPI_ROOT_URL: "https://api.vk.com/method/",


        CORE_PATH: "engine/core/",
        PLUGIN_PATH: "includes/plugin/",



        LOADER_TIMEOUT: 1000

    };



    Add( 'constants', {
        get: function( key ) {
            return __constants[ key ];
        },

        define: function( name, val ) {
            if ( !__constants.hasOwnProperty( name ) )
                __constants[ name ] = val;

        }
    } );

} );