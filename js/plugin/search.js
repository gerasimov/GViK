/**
 *
 *
 *
 *
 */

;
( function() {


    function vkcall( method, data, suc, err ) {
        gvik.vkapi.call( method, data, suc, err );
    }


    function audioSearch( artist, title, dur, callback, opt ) {
        vkcall( 'audio.search', {
            q: [ artist, title ].join( ' - ' ),
            count: 150,
            sort: 2
        }, function( res ) {
            find( artist, title, res.items, dur, callback, opt );
        } )
    }

    var _eq = function( a, b ) {
            return a.replace( /\s+/g, '' )
                .toLowerCase() === b.replace( /\s+/g, '' )
                .toLowerCase();
        },

        _eq2 = function( a, b ) {
            a = a.replace( /\s+/g, '' ).toLowerCase();
            b = b.replace( /\s+/g, '' ).toLowerCase();


            return a.indexOf( b ) !== -1 || b.indexOf( a ) !== -1;
        };

    function getBitrate( data, callback, error ) {

        gvik.chrome.simpleAjax( {
            url: data.audio.url,
            type: 'HEAD',
            getheader: 'Content-Length'
        }, function( len ) {
            data.bit = calcBit( data.audio.duration, len );
            callback( data );
        } );
    }

    function calcBit( dur, len ) {
        return ( ( len * 8 ) / ( dur || 1 ) / 1000 ) | 0
    }

    function getBiggestBitrate( audioMap, callback ) {

        var res = [],
            ready = false,
            data,

            fn = function() {

                if ( !( data = audioMap.shift() ) ) {
                    return callback( res.sort( function( a, b ) {
                        return b.bit - a.bit;
                    } ) );
                }

                getBitrate( data, function( _data ) {
                    if ( _data.bit > 250 ) return callback( _data );
                    res.push( _data );
                    fn();
                } );
            };

        fn();
    }


    function searchInArray( arr, arrAT, fn ) {
        var res = [];

        gvik.core.each( arr, function( audio ) {
            if ( fn( audio.artist, arrAT[ 0 ] ) && fn( audio.title, arrAT[ 1 ] ) ) {
                res.push( {
                    audio: audio,
                    dur: Math.abs( audio.duration - arrAT[ 2 ] )
                } );
            }
        }, true );

        return res;
    }

    function find( artist, title, arr, dur, callback, opt ) {

        var audioMap;

        if ( !( audioMap = searchInArray( arr, [ artist, title, dur ], _eq ) ).length &&
            !( audioMap = searchInArray( arr, [ artist, title, dur ], _eq2 ) ).length ) {
            return callback( arr[ 0 ] );
        }

        opt.maxbit ?
            getBiggestBitrate( audioMap, callback ) :
            callback( audioMap );
    }

    gvik.Add( 'search', {
        audioSearch: audioSearch
    } )

}() )