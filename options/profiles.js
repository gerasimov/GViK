;
( function() {

    var globalOpt;


    function init( data ) {
        globalOpt = data.options || {};
    }


    var profiles = {};


    profiles.change = function( uid, opts ) {
        globalOpt[ uid ] = opts;
        profiles.save();
    };

    profiles.restore = function( uid, callback ) {
        chrome.storage.local.get( uid, function( data ) {
            callback && callback( data[ uid ] || {} );
        } );
    };

    profiles.save = function() {
        chrome.storage.local.set( 'options', globalOpt );
    };


    chrome.storage.local.get( 'options', init );

}() );