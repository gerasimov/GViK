/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK( {
    'lastfm': 'enable'
}, function( gvik, require, Add ) {

    "use strict";


    var core = require( 'core' ),
        dom = require( 'dom' ),
        chrome = require( 'chrome' ),
        options = require( 'options' ),
        lastfmAPI = require( 'lastfmAPI' ),
        constants = require( 'constants' ),
        storage = require( 'storage' ),
        events = require( 'events' ),

        state = lastfmAPI.state,
        scrobble,
        scrobblePad,
        like,
        likePad,
        scrobbleMini,

        LastFM = function() {


            var $self = this;

            $self.CLASS_NAMES = {
                scrobble: 'gvik-scrobble icon-lastfm',
                like: 'gvik-like icon-heart',
                on: 'on',
                scrobbled: 'scrobbled icon-check'
            };


            scrobble = dom.create( 'div', {
                attr: {
                    'class': $self.CLASS_NAMES.scrobble
                },
                events: {
                    click: function( event ) {

                        if ( !lastfmAPI.authorized ) {
                            $self._setDisableState( true )
                            return lastfmAPI.auth();
                        }

                        $self._toggle()
                            ._setDisableState( false )
                            ._setErrorState( false )
                            ._setScrobbleState( false );

                        return chrome.sendTabs( 'LASTFM_changestate', state, 1 );

                    }
                }
            } );

            like = dom.create( 'div', {
                attr: {
                    'class': $self.CLASS_NAMES.like
                },
                events: {
                    click: function( event ) {

                        if ( !lastfmAPI.authorized ) {
                            $self._setDisableState( true )
                            return lastfmAPI.auth();
                        }


                        if ( !$self.artist || $self.title )
                            return;

                        var liked = storage.session.get( $self.trackId );

                        return lastfmAPI[ ( liked ? 'un' : '' ) + 'love' ]( {
                            artist: $self.artist,
                            track: $self.title
                        }, ( liked ? $self._removedLiked : $self._liked ) );
                    }
                }
            } );

            if ( state ) {
                scrobble.classList.add( $self.CLASS_NAMES.on );
            }

            likePad = dom.clone( like, true );
            scrobblePad = dom.clone( scrobble, true );
            scrobbleMini = dom.clone( scrobble, true );

            scrobbleMini.classList.add( 'mp' );

            $self.ELEMENTS = {
                like: [ like, likePad ],
                scrobble: [ scrobble, scrobblePad, scrobbleMini ]
            };

            if ( !lastfmAPI.authorized ) {
                $self._setDisableState( true );
            }

            $self.PERCENT = parseInt( options.get( 'lastfm', 'percent' ) ) || 50;

            $self.DISABLE_REPEAT_SCROBBLE = options.get( 'lastfm', 'disable-repeatScrobble' );


            if ( $self.PERCENT < 40 || $self.PERCENT > 90 ) {
                $self.PERCENT = 50;
            }

            $self.UPDATE_DELAY = constants.get( 'LASTFM_UPDATE_DELAY' );


            events


                .bind( 'LASTFM_connect', function( res ) {
                chrome
                    .sendTabs( 'LASTFM_enablebutton', null, 1 )
                    .sendTabs( 'LASTFM_changestate', true, 1 );
            } )

            .bind( 'audio', function( ev ) {
                var ac = dom.byId( 'ac' );
                if ( ac ) {
                    dom.addClass( ac, 'gvik' );
                    dom.append( dom.byClass( 'extra_ctrls', ac ).item( 0 ), [ like, scrobble ] );
                }
            }, true )

            .bind( 'playerOpen', function( ev ) {
                dom.byId( 'gp_wrap' ).appendChild( scrobbleMini );
                ev.el.classList.add( 'gvik' );
            } )

            .bind( 'padOpen', function( ev ) {
                var pd = dom.byId( 'pd' );
                if ( pd ) {
                    dom.addClass( pd, 'gvik' );
                    dom.append( dom.byClass( 'extra_ctrls', pd ).item( 0 ), [ likePad, scrobblePad ] );
                }
            } )


            .bind( 'audio.onPlayProgress', function( pos ) {

                if ( !state || $self.scrobbled )
                    return;

                if ( !( pos % $self.UPDATE_DELAY ) && pos <= $self.startScrobble - $self.UPDATE_DELAY ) {
                    lastfmAPI.update( {
                        artist: $self.artist,
                        track: $self.title
                    }, function() {
                        $self._setErrorState( false ).step++;
                    }, function( err ) {
                        $self._setErrorState( true, ( err && err.message ) || chrome.lang( 'error' ) );
                    } );
                }

                if ( $self.step >= $self.maxStep && pos >= $self.startScrobble ) {
                    $self.scrobbled = true;

                    lastfmAPI.scrobble( {
                        artist: $self.artist,
                        track: $self.title,
                        timestamp: $self.timestamp
                    }, function() {
                        $self._setErrorState( false )._setScrobbleState( true );
                    }, function() {
                        $self._setErrorState( true );
                    } );
                }
            } )



            .bind( 'audio.onStartPlay', function() {

                if ( !$self.DISABLE_REPEAT_SCROBBLE ) {
                    $self.step = 0;
                    $self.scrobbled = false;
                    $self._setScrobbleState( false )
                        ._setErrorState( false );
                }

                $self.timestamp = Math.floor( Date.now() / 1000 );

                events.trigger( 'lastfm.starttrack', {
                    artist: $self.artist,
                    title: $self.title,
                    duration: audioPlayer.duration,
                    trackId: $self.trackId
                } );


            } )

            .bind( 'audio.onNewTrack', function( trackId ) {

                $self.trackId = trackId;
                $self.artist = dom.unes( $self.info()[ 5 ] );
                $self.title = dom.unes( $self.info()[ 6 ] );
                $self.startScrobble = ~~( ( window.audioPlayer.duration / 100 ) * $self.PERCENT );
                $self.maxStep = Math.max( 1, Math.floor( $self.startScrobble / $self.UPDATE_DELAY ) - 1 );
                
                $self.step = 0;
                $self.scrobbled = false;
                $self._setScrobbleState( false )
                        ._setErrorState( false );

                events.trigger( 'lastfm.newtrack', {
                    artist: $self.artist,
                    title: $self.title,
                    url: $self.info()[ 2 ],
                    duration: window.audioPlayer.duration,
                    trackId: $self.trackId
                } );


                storage.session.get( $self.trackId ) ? $self._liked() : $self._removedLiked();
            } );



            chrome
                .globalFn( 'LASTFM_enablebutton', function() {
                    $self._setDisableState( false );
                } )
                .globalFn( 'LASTFM_changestate', function( _state ) {
                    _state ? $self._on() : $self._off();
                } );

        };

    LastFM.prototype = {
        _each: function( props, _callback ) {
            var _this = this;
            core.each( Array.isArray( props ) ? props : [ props ], function( curProp ) {
                core.each( _this.ELEMENTS[ curProp ], function( curEl ) {
                    _callback.call( _this, curEl );
                }, true );
            }, true );
            return this;
        },
        info: function() {
            return window.audioPlayer.lastSong || window.audioPlaylist[ audioPlayer.id ];
        },

        _on: function() {
            state = true;
            this._addClass( 'scrobble', this.CLASS_NAMES.on )._setScrobbleState( false );
        },

        _off: function() {
            state = false;
            this._removeClass( 'scrobble', this.CLASS_NAMES.on )._setScrobbleState( false );
        },

        _addClass: function( key, clas, fn ) {
            return this._each( key, function( element ) {
                dom.addClass( element, clas );
                fn && fn( element );
            } );
        },

        _removeClass: function( key, clas, fn ) {
            return this._each( key, function( element ) {
                dom.removeClass( element, clas );
                fn && fn( element );
            } );
        },

        _toggle: function() {
            !state ? this._on() : this._off();
            lastfmAPI.setConfig( {
                state: state
            } );
            return this;
        },

        _setDisableState: function( disState ) {
            return this._each( [ 'scrobble', 'like' ], disState ? function( element ) {
                element.setAttribute( 'data-disabled', '' );
            } : function( element ) {
                element.removeAttribute( 'data-disabled' );
            } );
        },

        _setErrorState: function( errState, msg ) {

            return this[ ( errState ? '_addClass' : '_removeClass' ) ]( 'scrobble', 'errors', function( el ) {
                if ( errState )
                    el.title = msg;
                else
                    el.removeAttribute( 'title' );
            } );
        },

        _toggleError: function() {
            return this._setErrorState( !dom.hasClass( scrobble, 'errors' ) );
        },

        _setScrobbleState: function( scrState ) {
            return this[ ( scrState ? '_addClass' : '_removeClass' ) ]( 'scrobble', this.CLASS_NAMES.scrobbled );
        },

        _toggleScrobbled: function() {
            return this._setScrobbleState( !dom.hasClass( scrobble, this.CLASS_NAMES.scrobbled ) );
        },

        _liked: function() {
            storage.session.set( this.trackId, true );
            return this._addClass( 'like', this.CLASS_NAMES.on );
        },

        _removedLiked: function() {
            storage.session.remove( this.trackId );
            return this._removeClass( 'like', this.CLASS_NAMES.on );
        }
    };

    Add( 'lastfm', new LastFM() );

} );