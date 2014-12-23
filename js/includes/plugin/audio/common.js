_GViK.Init( function( appData, require ) {

  var options = require( 'options' ),
    dom = require( 'dom' ),
    global = require( 'global' ),
    cache = require( 'cache' ),
    chrome = require( 'chrome' ),
    vkapi = require( 'vkapi' ),
    event = require( 'event' ),
    core = require( 'core' );

  global.VARS.PARSE_AUDIO_DATA = function( el, id ) {

    var act = dom.byClass( 'actions', el ).item( 0 ),
      input, url, dur, data;


    if ( !id )
      id = el.id;

    if ( ( data = cache.get( id ) ) ) {
      url = data.url;
      dur = data.dur;
    } else {
      input = dom.byTag( 'input', el ).item( 0 );
      parsedData = input.value.split( ',' );
      url = parsedData[ 0 ];
      dur = parsedData[ 1 ];
    }

    return {
      id: id,
      act: act,
      url: url,
      dur: dur
    };
  };

  if ( options.get( 'audio', 'faster' ) )
    event.bind( 'audio', function() {
      if ( window.sorter && window.sorter.added ) {
        window.sorter.added = function() {};
      }
    }, true );


} );