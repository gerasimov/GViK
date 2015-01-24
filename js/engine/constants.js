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
 

        SIDEBAR_LASTFM_TOP_TRACKS_LIMIT: 100,


        GOOGLE_ANALITICS_CODE: 'UA-51509924-1',


        VKAPI_APP_ID: 2224353,
        VKAPI_KEY_STORAGE: "vk",
        VKAPI_ROOT_URL: "https://api.vk.com/method/",


        BITRATE_TIMEOUT: 100,

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