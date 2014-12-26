_GViK( function( appData, require, Add ) {

  var options = require( 'options' ),
    dom = require( 'dom' ),
    global = require( 'global' ),
    cache = require( 'cache' ),
    chrome = require( 'chrome' ),
    vkapi = require( 'vkapi' ),
    event = require( 'event' ),
    core = require( 'core' );



  if ( options.get( 'audio', 'faster' ) )
    event.bind( 'audio', function() {
      if ( window.sorter && window.sorter.added ) {
        window.sorter.added = function() {};
      }
    }, true );


} );