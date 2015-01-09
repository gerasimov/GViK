/**
 *
 *
 *
 */



_GViK( {
    'video': 'download-enable',
}, function( appData, require, Add ) {


    var options = require( 'options' ),
        dom = require( 'dom' ),
        event = require( 'event' ),
        core = require( 'core' );


    var isurl = /^url(\d+)$/,
        res,
        parseVideoData = function( vars ) {
            var actcont = document.querySelector( '#mv_actions:not([data-gvikset])' );
            if ( !actcont ) {
                return;
            }
            dom.setData( actcont, 'gvikset', '' );

            dom.append( actcont, core.map( Object.keys( vars ), function( val ) {
                if ( ( res = val.match( isurl ) ) )
                    return dom.create( 'a', {
                        prop: {
                            href: vars[ val ],
                            download: vars.md_title,
                            innerText: 'Скачать ' + res[ 1 ]
                        }
                    } );
            } ) );
        },
        varsToObject = function( vars ) {
            return core.toObject( core.map( vars.split( /\&/g ), function( val ) {
                return decodeURIComponent( val )
                    .split( '=' );
            } ) );
        };

    var vp = document.getElementById( 'video_player' );

    if ( vp ) {
        parseVideoData( varsToObject( vp.getAttribute( 'flashvars' ) ) );
    }

    if ( window.renderFlash )
        window.renderFlash.bindFuncAfter( function( data ) {
            parseVideoData( data[ 0 ][ 3 ] );
        } );


} );