/**
 *
 *
 *
 */

_GViK.Init( function( gvik, require ) {

  "use strict";

  var core = require( 'core' );

  window.ga = function() {};

  core.define( [
    'https://www.google-analytics.com/analytics.js'
  ], function() {
    ga( 'create', 'UA-51509924-1', 'auto' );
    ga( 'set', 'checkProtocolTask', function() {} );
    ga( 'require', 'displayfeatures' );
    ga( 'send', 'pageview', '/background.html' );
  } );


} );