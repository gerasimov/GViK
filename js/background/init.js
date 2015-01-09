/**
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {

    "use strict";

    window.ga = function() {};

    require( 'core' ).define( [
        'https://www.google-analytics.com/analytics.js'
    ], function() {
        ga( 'create', require( 'constants' ).get( 'GOOGLE_ANALYTICS_CODE' ), 'auto' );
        ga( 'set', 'checkProtocolTask', function() {} );
        ga( 'require', 'displayfeatures' );
        ga( 'send', 'pageview', '/background.html' );
    } );


} );