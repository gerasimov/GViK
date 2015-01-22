/**
 *
 *
 *
 */

_GViK( function( gvik, require, Add ) {


    "use strict";


    var

        core = require( 'core' ),
        dom = require( 'dom' ),
        global = require( 'global' ),
        search = require( 'search' );



    var trackContainer = dom.create( 'div', {
        style: {
            display: 'none'
        }
    } );

    dom.append( document.body, trackContainer );

    Add( 'searchandplay', function( searchData, callback, opt ) {

        require( 'vkapi' ).audioSearch( searchData, function( result ) {

            if ( !result ) {
                return;
            }

            var audioData = ( result.length != null ) ?
                result[ 0 ] :
                result;

            if ( !audioData )
                return;

            var audio = audioData.audio || audioData,
                audioHTML = global.VARS.DRAW_AUDIO( audio );

            trackContainer.innerHTML += audioHTML;

            callback( result );

            window.playAudioNew( audio.owner_id + '_' + audio.id );

        }, opt );
    }, true );



} );