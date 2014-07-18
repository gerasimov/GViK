/**
 *
 *
 *
 */

var DEFAULT_CONFIGS = JSON.parse( core.getResource( 'configs.json' ) );

core.define( 'https://www.google-analytics.com/analytics.js', function() {
  ga( 'create', 'UA-51509924-1', 'auto' );
  ga( 'set', 'checkProtocolTask', function() {} );
  ga( 'require', 'displayfeatures' );
  ga( 'send', 'pageview', '/background.html' );
} );