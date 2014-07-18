/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


gvik.Add('lastfm', function(gvik) {


    var lastfmAPI = gvik.lastfmAPI,
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


            scrobble = gvik.dom.create('div', {
                attr: {
                    'class': this.CLASS_NAMES.scrobble
                },
                events: {
                    click: this._sevent.bind(this)
                }
            });

            like = gvik.dom.create('div', {
                attr: {
                    'class': this.CLASS_NAMES.like
                },
                events: {
                    click: this._levent.bind(this)
                }
            });

            if (state) {
                scrobble.classList.add(this.CLASS_NAMES.on);
            }

            likePad = gvik.dom.clone(like, true);
            scrobblePad = gvik.dom.clone(scrobble, true);
            scrobbleMini = gvik.dom.clone(scrobble, true);

            scrobbleMini.classList.add('mp');

            this.ELEMENTS = {
                like: [like, likePad],
                scrobble: [scrobble, scrobblePad, scrobbleMini]
            };

            if (!this.api.authorized) {
                this._setDisableState(true);
            }

            this.PERCENT = parseInt(gvik.GetConfig('lastfm', 'percent')) || 50;

            if (this.PERCENT < 40 || this.PERCENT > 90) {
                this.PERCENT = 50;
            }

            this.UPDATE_DELAY = 20;


            gvik.event.bind(['audio', 'DOMLoad'], function(ev) {
                    if (ev && ev.fired) {
                        return;
                    }

                    var ac = document.getElementById('ac');

                    if (!ac) {
                        return;
                    }

                    ac.classList.add('gvik');

                    var exct = ac.getElementsByClassName('extra_ctrls')[0];

                    if (exct) {
                        gvik.dom.append(exct, [like, scrobble]);
                    }

                }.bind(this))
                .on('playerOpen', null, function(ev) {

                    if (ev && ev.fired) {
                        return;
                    }

                    var fn = window.audioPlayer.setCurTime,
                        _this = this;

                    window.audioPlayer.setCurTime = function() {
                        var res = fn.apply(this, arguments);
                        _this.playProgress.apply(_this, arguments);
                        return res;
                    };

                    var gpW = document.getElementById('gp_wrap');

                    gpW && gpW.appendChild(scrobbleMini);
                    ev.el.classList.add('gvik');

                }.bind(this))

            .on('padOpen', null, function(ev) {
                if (ev && ev.fired) {
                    return;
                }

                var pd = document.getElementById('pd');

                if (!pd) {
                    return;
                }

                pd.classList.add('gvik');

                var exct = pd.getElementsByClassName('extra_ctrls')
                    .item(0);

                if (exct) {
                    gvik.dom.append(exct, [likePad, scrobblePad]);
                }
            });



            gvik.chrome
                .globalFn('LASTFM_enablebutton', function() {
                    this._setDisableState(false)
                }, this)
                .globalFn('LASTFM_changestate', function(response) {
                    response.data ? this._on() : this._off();
                }, this);



        };

    LastFM.prototype = {
        api: lastfmAPI,
        _each: function(props, _callback) {
            var _this = this;
            gvik.core.each(Array.isArray(props) ? props : [props], function(curProp) {
                gvik.core.each(_this.ELEMENTS[curProp], function(curEl) {
                    _callback.call(_this, curEl)
                }, true)
            }, true);
            return this;
        },
        info: function() {
            return window.audioPlayer.lastSong || window.audioPlaylist[audioPlayer.id];
        },
        reset: function() {
            this.step = 0;
            this.scrobbled = false;
            this.timestamp = Math.floor(Date.now() / 1000);
            this.position = -1;

            gvik.event.trigger('starttrack', {
                artist: this.artist,
                title: this.title,
                duration: audioPlayer.duration,
                trackId: this.trackId
            });

            return this._setScrobbleState(false)
                ._setErrorState(false);
        },

        setData: function(track) {
            this.artist = gvik.util.unes(this.info()[5]);
            this.title = gvik.util.unes(this.info()[6]);
            this.startScrobble = ~~((audioPlayer.duration / 100) * this.PERCENT);
            this.maxStep = Math.max(1, Math.floor(this.startScrobble / this.UPDATE_DELAY) - 1);
            this.readyD = false;

            gvik.event.trigger('newtrack', {
                artist: this.artist,
                title: this.title,
                duration: audioPlayer.duration,
                trackId: this.trackId
            });


            gvik.session.get(this.trackId) ? this._liked() : this._removedLiked();
        },

        _on: function() {
            state = true;
            this._addClass('scrobble', this.CLASS_NAMES.on)
                ._setScrobbleState(false);
        },

        _off: function() {
            state = false;
            this._removeClass('scrobble', this.CLASS_NAMES.on)
                ._setScrobbleState(false);
        },

        _addClass: function(key, clas, fn) {
            return this._each(key, function(element) {
                gvik.dom.addClass(element, clas);
                fn && fn(element);
            })
        },

        _removeClass: function(key, clas, fn) {
            return this._each(key, function(element) {
                gvik.dom.removeClass(element, clas);
                fn && fn(element);
            })
        },

        _toggle: function() {
            !state ? this._on() : this._off();
            this.api.setConfig({
                state: state
            });
            return this;
        },

        _setDisableState: function(disState) {
            return this._each(['scrobble', 'like'], disState ? function(element) {
                element.setAttribute('data-disabled', '');
            } : function(element) {
                element.removeAttribute('data-disabled');
            })
        },

        _setErrorState: function(errState, msg) {

            if (!errState) {
                return this._removeClass('scrobble', 'errors', function(el) {
                    el.removeAttribute('title');
                });
            }

            return this._addClass('scrobble', 'errors', function(el) {
                el.title = msg;
            });
        },

        _toggleError: function() {
            return this._setErrorState(!gvik.dom.hasClass(scrobble, 'errors'));
        },

        _setScrobbleState: function(scrState) {
            return scrState ?
                this._addClass('scrobble', this.CLASS_NAMES.scrobbled) :
                this._removeClass('scrobble', this.CLASS_NAMES.scrobbled);
        },

        _toggleScrobbled: function() {
            return this._setScrobbleState(!gvik.dom.hasClass(scrobble, this.CLASS_NAMES.scrobbled))
        },

        _liked: function() {
            gvik.session.set(this.trackId, true);
            return this._addClass('like', this.CLASS_NAMES.on);
        },

        _removedLiked: function() {
            gvik.session.remove(this.trackId);
            return this._removeClass('like', this.CLASS_NAMES.on);
        },

        _sevent: function(event) {

            if (!this.api.authorized) {
                return this._setDisableState(true)
                    .api.auth();
            } else {
                this._setDisableState(false);
            }

            this._toggle()._setErrorState(false)._setScrobbleState(false);

            return gvik.chrome.sendTabs('LASTFM_changestate', {
                data: state
            });

        },

        _levent: function(event) {

            if (!this.api.authorized) {
                return this._setDisableState(true)
                    .api.auth();
            }

            var liked = gvik.session.get(this.trackId);

            return this.api[(liked ? 'un' : '') + 'love']({
                artist: this.artist,
                track: this.title
            }, function() {
                liked ?
                    this._removedLiked() :
                    this._liked();
            }.bind(this));
        },

        _update_: function(callback) {
            return this.api.update({
                artist: this.artist,
                track: this.title
            }, function() {
                this._setErrorState(false)
                    .step++;

                callback && callback.call(this);
            }.bind(this), function(err) {
                console.log(2)
                this._setErrorState(true, (err && err.message) || gvik.chrome.lang('error'))
            }.bind(this));

        },

        _scrobble_: function(callback) {
            return this.api.scrobble({
                artist: this.artist,
                track: this.title,
                timestamp: this.timestamp
            }, function() {
                this._setErrorState(false)
                    ._setScrobbleState(true);
                callback && callback.call(this);
            }.bind(this), function() {
                this._setErrorState(true)
            }.bind(this));
        },

        playProgress: function(pos, len) {

            if (pos === this.position) {
                return;
            }

            if (pos < this.UPDATE_DELAY) {

                if (this.trackId !== audioPlayer.id) {
                    this.trackId = audioPlayer.id;
                    this.setData();
                }

                if (!this.readyD) {
                    this.reset();
                    this.readyD = true;
                    if (state) {
                        this._update_();
                    }
                }

            } else this.readyD = false;

            this.position = pos;

            if (!state || this.scrobbled || !pos) {
                return;
            }

            if (!(pos % this.UPDATE_DELAY) && pos <= this.startScrobble - this.UPDATE_DELAY) {
                this._update_();
            }

            if (this.step >= this.maxStep && pos >= this.startScrobble) {
                this.scrobbled = true;
                this._scrobble_();
            }

        }
    };


    return new LastFM;

}(window.gvik));
