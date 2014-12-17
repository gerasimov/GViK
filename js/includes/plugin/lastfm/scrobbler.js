/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


_GViK.Init( {
    'lastfm': 'enable'
}, function( gvik, require ) {

    "use strict";


    var core = require( 'core' ),
        dom = require( 'dom' ),
        chrome = require( 'chrome' ),
        configs = require( 'configs' ),
        lastfmAPI = require( 'lastfmAPI' ),
        storage = require( 'storage' ),
        event = require( 'event' ),

        state = lastfmAPI.state,
        scrobble,
        scrobblePad,
        like,
        likePad,
        scrobbleMini,

        LastFM = function() {

            this.CLASS_NAMES = {
                scrobble: 'gvik-scrobble icon-lastfm',
                like: 'gvik-like icon-heart',
                on: 'on',
                scrobbled: 'scrobbled icon-check'
            };


            scrobble = dom.create( 'div', {
                attr: {
                    'class': this.CLASS_NAMES.scrobble
                },
                events: {
                    click: this._sevent.bind( this )
                }
            } );

            like = dom.create( 'div', {
                attr: {
                    'class': this.CLASS_NAMES.like
                },
                events: {
                    click: this._levent.bind( this )
                }
            } );

            if ( state ) {
                scrobble.classList.add( this.CLASS_NAMES.on );
            }

            likePad = dom.clone( like, true );
            scrobblePad = dom.clone( scrobble, true );
            scrobbleMini = dom.clone( scrobble, true );

            scrobbleMini.classList.add( 'mp' );

            this.ELEMENTS = {
                like: [ like, likePad ],
                scrobble: [ scrobble, scrobblePad, scrobbleMini ]
            };

            if ( !this.api.authorized ) {
                this._setDisableState( true );
            }

            this.PERCENT = parseInt( configs.get( 'lastfm', 'percent' ) ) || 50;

            if ( this.PERCENT < 40 || this.PERCENT > 90 ) {
                this.PERCENT = 50;
            }

            this.UPDATE_DELAY = 20;


            event.bind( 'audio', function( ev ) {

                var ac = document.getElementById( 'ac' );

                if ( !ac ) {
                    return;
                }

                ac.classList.add( 'gvik' );

                var exct = ac.querySelector( '.extra_ctrls' );

                if ( exct ) {
                    dom.append( exct, [ like, scrobble ] );
                }

            }.bind( this ), true )

            .bind( 'onPlayAudio', function( data ) {
                this.playProgress.apply( this, data.arg );
            }.bind( this ) )

            .bind( 'playerOpen', function( ev ) {

                var gpW = document.getElementById( 'gp_wrap' );

                if ( gpW )
                    gpW.appendChild( scrobbleMini );
                ev.el.classList.add( 'gvik' );

            }.bind( this ) )

            .bind( 'padOpen', function( ev ) {
                var pd = document.getElementById( 'pd' );

                if ( !pd ) {
                    return;
                }

                pd.classList.add( 'gvik' );

                var exct = pd.getElementsByClassName( 'extra_ctrls' )
                    .item( 0 );

                if ( exct ) {
                    dom.append( exct, [ likePad, scrobblePad ] );
                }
            }.bind( this ) );



            chrome
                .globalFn( 'LASTFM_enablebutton', function() {
                    this._setDisableState( false );
                }, this )
                .globalFn( 'LASTFM_changestate', function( response ) {
                    response.data ? this._on() : this._off();
                }, this );



        };

    LastFM.prototype = {
        api: lastfmAPI,
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
        reset: function(itsnewtrack, changeslider) {

            this.step = !changeslider ? 0 : 1;

            this.scrobbled = false;
            this.timestamp = Math.floor( Date.now() / 1000 );
            this.position = -1;

            event.trigger( 'starttrack', {
                artist: this.artist,
                title: this.title,
                duration: audioPlayer.duration,
                trackId: this.trackId
            } );

            return this._setScrobbleState( false )
                ._setErrorState( false );
        },

        setData: function( track ) {
            this.artist = dom.unes( this.info()[ 5 ] );
            this.title = dom.unes( this.info()[ 6 ] );
            this.startScrobble = ~~ ( ( audioPlayer.duration / 100 ) * this.PERCENT );
            this.maxStep = Math.max( 1, Math.floor( this.startScrobble / this.UPDATE_DELAY ) - 1 );
            this.readyD = false;

            event.trigger( 'newtrack', {
                artist: this.artist,
                title: this.title,
                duration: audioPlayer.duration,
                trackId: this.trackId
            } );


            storage.session.get( this.trackId ) ? this._liked() : this._removedLiked();
        },

        _on: function() {
            state = true;
            this._addClass( 'scrobble', this.CLASS_NAMES.on )
                ._setScrobbleState( false );
        },

        _off: function() {
            state = false;
            this._removeClass( 'scrobble', this.CLASS_NAMES.on )
                ._setScrobbleState( false );
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
            this.api.setConfig( {
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

            if ( !errState ) {
                return this._removeClass( 'scrobble', 'errors', function( el ) {
                    el.removeAttribute( 'title' );
                } );
            }

            return this._addClass( 'scrobble', 'errors', function( el ) {
                el.title = msg;
            } );
        },

        _toggleError: function() {
            return this._setErrorState( !dom.hasClass( scrobble, 'errors' ) );
        },

        _setScrobbleState: function( scrState ) {
            return scrState ?
                this._addClass( 'scrobble', this.CLASS_NAMES.scrobbled ) :
                this._removeClass( 'scrobble', this.CLASS_NAMES.scrobbled );
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
        },

        _sevent: function( event ) {

            if ( !this.api.authorized ) {
                return this._setDisableState( true )
                    .api.auth();
            } else {
                this._setDisableState( false );
            }

            this._toggle()._setErrorState( false )._setScrobbleState( false );

            return chrome.sendTabs( 'LASTFM_changestate', {
                data: state
            } );

        },

        _levent: function( event ) {

            if ( !this.api.authorized ) {
                return this._setDisableState( true )
                    .api.auth();
            }

            var liked = storage.session.get( this.trackId );

            return this.api[ ( liked ? 'un' : '' ) + 'love' ]( {
                artist: this.artist,
                track: this.title
            }, function() {
                liked ?
                    this._removedLiked() :
                    this._liked();
            }.bind( this ) );
        },

        _update_: function( callback ) {
            return this.api.update( {
                artist: this.artist,
                track: this.title
            }, function() {
                this._setErrorState( false )
                    .step++;

                callback && callback.call( this );
            }.bind( this ), function( err ) {
                this._setErrorState( true, ( err && err.message ) || chrome.lang( 'error' ) );
            }.bind( this ) );

        },

        _scrobble_: function( callback ) {
            return this.api.scrobble( {
                artist: this.artist,
                track: this.title,
                timestamp: this.timestamp
            }, function() {
                this._setErrorState( false )
                    ._setScrobbleState( true );
                callback && callback.call( this );
            }.bind( this ), function() {
                this._setErrorState( true );
            }.bind( this ) );
        },

        playProgress: function( pos, len ) {

            if ( pos === this.position ) {
                return;
            }

            if ( pos < this.UPDATE_DELAY ) {

                var itsnewtrack = this.trackId !== audioPlayer.id,
                    changeslider = pos < this.position;

                if ( itsnewtrack ) {
                    this.trackId = audioPlayer.id;
                    this.setData();
                }

                if ( !this.readyD ) {
                    this.reset( itsnewtrack, changeslider );
                    this.readyD = true;
                    if ( state ) {
                        this._update_();
                    }
                }

            } else this.readyD = false;

            this.position = pos;

            if ( !state || this.scrobbled || !pos ) {
                return;
            }

            if ( !( pos % this.UPDATE_DELAY ) && pos <= this.startScrobble - this.UPDATE_DELAY ) {
                this._update_();
            }

            if ( this.step >= this.maxStep && pos >= this.startScrobble ) {
                this.scrobbled = true;
                this._scrobble_();
            }

        }
    };

    _GViK.Add( 'lastfm', new LastFM() );

} );