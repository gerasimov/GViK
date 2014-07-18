"use strict";

gvik.Add( 'lastfmAPI', function() {

    function LastFMAPI() {

        var token = location.href.match( /\?token\=(\w+)\#gvik_lastfm/ );


        if ( token ) {

            try {
                history.pushState( {}, '', location.pathname );
            } catch ( e ) {}

            this.getSession( token[ 1 ], function( res ) {
                var response = {
                    sk: res.session.key,
                    name: res.session.name,
                    state: true
                };

                this.setConfig( response );

                gvik.chrome.sync.set( {
                    lastfm: response
                } )
                    .sendTabs( 'LASTFM_enablebutton' )
                    .sendTabs( 'LASTFM_changestate', {
                        data: true
                    } );

            }.bind( this ) );
        }

    }

    LastFMAPI.prototype = {
        get data() {
            return gvik.local.getJSON( 'lastfm' ) || {};
        },

        setConfig: function( param ) {
            return gvik.local.setJSON( 'lastfm', gvik.core.extend( {}, this.data, param ) );
        },

        get sessionKey() {
            return this.data.sk;
        },

        get name() {
            return this.data.name;
        },

        get state() {
            return this.data.state;
        },

        get ROOT_URL() {
            return 'https://ws.audioscrobbler.com/2.0/';
        },

        get KEY() {
            return 'ec0478e7bd7a9fd3c8b44bf9672bf6b2';
        },

        get SECRET() {
            return '191c6d3f39d3c59f28b7305b05d08772'
        },

        get authorized() {
            var s = this.sessionKey,
                n = this.name;
            return !!( s && n );
        },

        getSignature: function( params ) {
            return gvik.md5( gvik.core.map( params, function( v, k ) {
                    return k + v
                } )
                .sort()
                .join( '' ) + this.SECRET );
        },

        _errorCode: {
            '9': function() {
                gvik.local.remove( 'lastfm' );
                gvik.chrome.sync.remove( 'lastfm' );
                this.auth();
            },

            '6': function() {}
        },

        call: function( method, data, _callback, _error ) {

            data = data || {};

            if ( this.sessionKey ) {
                data.sk = this.sessionKey;
            }

            gvik.core.extend( data, {
                lang: "ru",
                method: method,
                api_key: this.KEY
            } );

            data.api_sig = this.getSignature( data );
            data.format = 'json';


            gvik.chrome.simpleAjax( {
                    type: 'POST',
                    url: this.ROOT_URL,
                    dataType: 'json',
                    data: data
                }, function( response ) {
                    var errCode = response.error,
                        errFn = this._errorCode[ errCode ];

                    if ( errCode ) {
                        errFn && errFn();
                        return _error( response );
                    }

                    _callback( response );
                }.bind( this ), ( function() {
                    _error.apply( this, arguments );
                } )
                .bind( this ) );

            return this;
        },

        _call: function( method, params, callback, error, prop ) {
            return this.call( method, params, function( res ) {
                if ( res.hasOwnProperty( prop ) ) {
                    callback.apply( this, arguments )
                } else if ( typeof error === 'function' ) {
                    error.apply( this, arguments );
                }
            }, error );
        },

        getSession: function( token, callback, error ) {
            return this._call( "auth.getSession", {
                token: token
            }, callback, error, 'session' );
        },

        auth: function() {

            gvik.chrome.sync.get( {
                key: 'lastfm'
            }, function( vals, key ) {

                if ( !vals.lastfm || !vals.lastfm.sk ) {
                    if ( window.audioPlayer && window.audioPlayer.id ) {
                        audioPlayer.operate( audioPlayer.id );
                    }
                    return gvik.chrome.openTab( 'http://www.last.fm/api/auth/?api_key=' + this.KEY );
                }

                this.setConfig( vals.lastfm );

                gvik.chrome.sync.set( {
                    lastfm: vals.lastfm
                } )
                    .sendTabs( 'LASTFM_enablebutton' )
                    .sendTabs( 'LASTFM_changestate', {
                        data: true
                    } );

            }.bind( this ) );
            return this;
        },

        scrobble: function( arg, callback, error ) {
            return this._call( 'track.scrobble', arg, callback, error, "scrobbles" );
        },

        update: function( arg, callback, error ) {
            return this._call( 'track.updateNowPlaying', arg, callback, error, "nowplaying" );
        },

        love: function( arg, callback, error ) {
            return this._call( 'track.love', arg, callback, error, 'status' );
        },

        unlove: function( arg, callback, error ) {
            return this._call( 'track.unlove', arg, callback, error, 'status' );
        },

        getLoved: function( arg, callback, error ) {
            return this._call( 'user.getLovedTracks', arg, callback, error, 'lovedtracks' );
        }
    };


    return new LastFMAPI();
} )