/**
 * @author Gerasimov Ruslan
 * @email gerasimow.ruslan@gmail.com
 * Copyright 2013 Gerasimov Ruslan. All rights reserved.
 */


;
(function() {

    if (!gvik.GetConfig('sidebar', 'lastfm-module')) {
        return;
    }

    var nameArtist,
        nameTrack,
        nameAlbum,
        lastNameTrack = '',
        lastNameArtist = '',
        lastNameAlbum = '',
        albumTrackList = [],
        lastResult,
        lastMbid,
        wrap,
        tabCont,
        topTab,
        albumTab,
        audoNameCont = {},
        locked = false,

        cnfg = gvik.GetConfig('sidebar');


    function lfapiCall(method, data, callback, error) {

        gvik.lastfm.api.call(method, data, function(res, isError) {
            lastResult = res;
            return typeof callback === 'function' && callback.apply(this, arguments)
        }, function() {
            return error && error.apply(this, arguments);
        });
    }


    var label = 'Last.fm ' + (gvik.lastfmAPI ? '' : '( Выключен Last.fm )'),

        labelEl = gvik.dom.create('div', {
            prop: {
                className: 'label',
                innerText: label
            }
        }),

        imgEl = gvik.dom.create('img', {
            events: {

            }
        }),

        cover = gvik.dom.create('div', {
            append: imgEl,
            prop: {
                className: 'cover'
            }
        }),

        tagsCont = gvik.dom.create('div', {
            prop: {
                className: 'tags'
            }
        }),

        artistInfoCont = gvik.dom.create('div', {
            prop: {
                className: 'artistInfo'
            },
            append: [labelEl, cover, tagsCont]
        }),

        tracksCont = gvik.dom.create('div', {
            prop: {
                className: 'tracks'
            }
        }),

        albTracksCont = gvik.dom.create('div', {
            prop: {
                className: 'tracks gvik-none'
            }
        }),

        tabs = gvik.dom.create('div', {
            prop: {
                className: 'tabs gvik-none'
            },
            append: [
                (topTab = gvik.dom.create('input', {
                    prop: {
                        className: 'tab',
                        type: 'radio',
                        checked: true,
                        name: 'gvik_lastfm_tabs'
                    },
                    data: {
                        label: 'Top'
                    },
                    events: {
                        change: function() {
                            albTracksCont.classList.add('gvik-none');
                            tracksCont.classList.remove('gvik-none');
                        }
                    }
                })),

                (albumTab = gvik.dom.create('input', {
                    prop: {
                        className: 'tab',
                        type: 'radio',
                        name: 'gvik_lastfm_tabs'
                    },
                    data: {
                        label: 'Album'
                    },
                    events: {
                        change: function() {
                            tracksCont.classList.add('gvik-none');
                            albTracksCont.classList.remove('gvik-none');
                        }
                    }
                }))
            ]
        }),

        trackInfoCont = gvik.dom.create('div', {
            append: [tabs, tracksCont, albTracksCont]
        })

    TMPL = {
        item: '<div class="item gvikLastfm" data-duration="<%=duration>" data-trackName="<%=name>">\
            <div class="item-cont">\
                <div class="img-cont">\
                    <div class="img" style="background-image: url(\'<%=img>\');"></div>\
                </div>\
                <div class="label-cont">\
                    <a class="label"><%=name></a>\
                    <span class="duration" ><%=dur></span>\
                </div>\
            </div>\
        </div>',

        tag: '<span class="tag">\
                <a target="_blank" href="<%=url>"><%=tag></a>\
                </span>',

        audio: '<div class="audio fl_l" id="audio%audio_id%" onmouseover="addClass(this, \'over \');" onmouseout="removeClass(this, \'over\');">\
                  <a name="%audio_id%"></a>\
                  <div class="area clear_fix" onclick="if (cur.cancelClick){ cur.cancelClick = false; return;} %onclick%">\
                    <div class="play_btn fl_l">\
                      <div class="play_btn_wrap"><div class="play_new" id="play%audio_id%"></div></div>\
                      <input type="hidden" id="audio_info%audio_id%" value="%url%,%playtime%" />\
                    </div>\
                    <div class="info fl_l">\
                      <div class="title_wrap fl_l" onmouseover="setTitle(this);"><b><a %attr%>%performer%</a></b> &ndash; <span class="title">%title% </span><span class="user" onclick="cur.cancelClick = true;">%author%</span></div>\
                      <div class="actions">\
                        %actions%\
                      </div>\
                      <div class="duration fl_r">%duration%</div>\
                    </div>\
                  </div>\
                  <div id="lyrics%audio_id%" class="lyrics" nosorthandle="1"></div>\
                </div>'
    };


    function resetAlbum() {
        gvik.dom.empty(albTracksCont);
        albumTab.setAttribute('data-label', 'Album');
        topTab.dispatchEvent(new Event('change'));
        topTab.checked = true;

        tabs.classList.add('gvik-none');
    }


    function resetArtist() {
        gvik.dom.empty(np);
        gvik.dom.empty(tracksCont);
        gvik.dom.empty(tagsCont);
        labelEl.innerText = '';
        imgEl.src = '';
        lastNameArtist = '';
        lastNameTrack = '';
        lastNameAlbum = '';
        cover.style.backgroundImage = 'none';

    }

    function secToTime(sec) {
        var result = [],

            hours = ('00' + ((sec / 3600 % 3600) | 0))
            .slice(-2),
            mins = ('00' + (((sec / 60) % 60) | 0))
            .slice(-2),
            secs = ('00' + (sec % 60))
            .slice(-2);

        if (hours !== '00') {
            result.push(hours);
        }
        result.push(mins);
        result.push(secs);

        return result.join(':');
    }

    function getArtistInfo(callback, error) {

        lfapiCall('artist.getInfo', {
            artist: nameArtist,
            correction: 1
        }, function(response) {
            var responseArtist = response.artist;
            nameArtist = responseArtist.name;
            if (typeof callback === 'function') {
                callback.call(this, responseArtist);
            }
            gvik.event.trigger('SIDEBAR_LASTFM_artistinfoload', responseArtist);

        }, function(s) {
            error && error();
        });
    }

    function getTrackInfo(callback, error) {
        lfapiCall('track.getInfo', {
            artist: nameArtist,
            track: nameTrack,
            correction: 1
        }, function(response) {
            var responseTrack = response.track;
            nameTrack = responseTrack.name;
            if (responseTrack.album) {
                nameAlbum = responseTrack.album.title;
            }
            if (typeof callback === 'function') {
                callback.call(this, responseTrack);
            }

            gvik.event.trigger('SIDEBAR_LASTFM_trackinfoload', responseTrack);
        });
    }


    function getAlbumInfo(callback, error) {
        lfapiCall('album.getInfo', {
            artist: nameArtist,
            album: nameAlbum
        }, function(response) {
            if (typeof callback === 'function') {
                callback.call(this, response.album);
            }
            gvik.event.trigger('SIDEBAR_LASTFM_albumload', response.album);
        }, function() {
            resetAlbum();
        });
    }

    function getTracks(callback, error) {
        lfapiCall('artist.getTopTracks', {
            artist: nameArtist,
            correction: 1,
            limit: 150
        }, function(response) {
            if (typeof callback === 'function') {
                callback.call(this, response.toptracks);
            }
            gvik.event.trigger('SIDEBAR_LASTFM_toptracksload', response.toptracks);
        }, function() {
            gvik.dom.empty(tracksCont);
        });
    }

    function drawAudio(audio, callback) {

        var _drawAudio = function(audio) {
            return rs(TMPL.audio, {
                audio_id: audio[0] + '_' + audio[1],
                performer: audio[5],
                title: audio[6],
                url: audio[2],
                playtime: audio[3],
                duration: audio[4]
            });
        };

        return _drawAudio([
            audio.owner_id,
            audio.id,
            audio.url,
            audio.duration,
            secToTime(audio.duration),
            audio.artist,
            audio.title,
            0,
            0,
            1
        ]);
    }



    gvik.event
        .on('SIDEBAR_LASTFM_newartist', 0, getArtistInfo)
        .on('SIDEBAR_LASTFM_newartist', 0, getTracks)
        .on('SIDEBAR_LASTFM_load', 0, getTrackInfo)
        .on('SIDEBAR_LASTFM_trackinfoload', 0, function(track) {
            if (track.album) {
                getAlbumInfo();
            } else {
                resetAlbum();
            }
        });

    function render(tmpl, arr, fn) {
        var html = '',
            i = 0,
            l = arr.length,
            _c;

        for (; i < l; i++) {
            _c = arr[i];
            html += gvik.util.tmpl(tmpl, fn(_c));
        }

        return html;
    }


    gvik.event
        .on('SIDEBAR_LASTFM_artistinfoload', 0, function(artist) {

            labelEl.innerText = artist.name;

            imgEl.src = artist.image[2]['#text'];
            cover.style.backgroundImage = 'url(' + artist.image[2]['#text'] + ')';

            var tag = (artist.tags || {})
                .tag || [];

            if (!Array.isArray(tag)) {
                tag = [tag];
            }

            tagsCont.innerHTML = render(TMPL.tag, tag.sort(function(a, b) {
                return a.name.length < b.name.length ? 1 : 0;
            }), function(curTag) {
                return {
                    url: curTag.url,
                    tag: curTag.name
                };
            });

        })
        .on('SIDEBAR_LASTFM_toptracksload', 0, function(responseTracks) {
            tracksCont.innerHTML = render(TMPL.item, responseTracks.track || [], function(curTrack) {
                return {
                    url: curTrack.url,
                    name: curTrack.name,
                    dur: secToTime(curTrack.duration),
                    duration: curTrack.duration,
                    img: (curTrack.image ? curTrack.image[1]['#text'] : (gvik.APP_PATH + 'img/album.png') /*responseArtist.image[ 1 ][ '#text' ]*/ )
                };
            });
        })

    .on('SIDEBAR_LASTFM_albumload', 0, function(album) {

            if (!album.name) {
                return resetAlbum();
            }

            var albName = [album.name];

            if (album.releasedate) {
                var res = album.releasedate.trim()
                    .match(/\d{4}/);
                if (res) {
                    albName.push(res[0]);
                }
            }

            albumTab.setAttribute('data-label', albName.join(', '));

            if (album.tracks && album.tracks.track) {
                var track = album.tracks.track;
            }

            if (!track || !track.length) {
                return gvik.dom.empty(albTracksCont);
            }

            albTracksCont.innerHTML = render(TMPL.item, track, function(curTrack) {
                return {
                    url: curTrack.url,
                    name: curTrack.name,
                    duration: curTrack.duration,
                    dur: secToTime(curTrack.duration),
                    img: album.image[1]['#text']
                };
            });

            albumTab.dispatchEvent(new Event('change'));
            albumTab.checked = true;

            tabs.classList.remove('gvik-none');

        })
        .on('newtrack', 0, function(data) {

            nameArtist = data.artist;
            nameTrack = data.title;

            var cart = data.artist.toLowerCase()
                .split(/\s+/g)
                .join(''),
                ctit = data.title.toLowerCase()
                .split(/\s+/g)
                .join('');

            if (cart !== lastNameArtist) {
                resetAlbum();
                resetArtist();
                gvik.event.trigger('SIDEBAR_LASTFM_newartist', data);
            }

            if (ctit !== lastNameTrack) {
                gvik.event.trigger('SIDEBAR_LASTFM_newtrack', data);

            }

            lastNameArtist = cart;
            lastNameTrack = ctit;

            gvik.event.trigger('SIDEBAR_LASTFM_load', data);

        });

    gvik.sidebar.addPage(function(_switcher, _tabCont, _wrap, countPage) {

        _switcher.classList.add('icon-lastfm');
        _tabCont.classList.add('loaded');

        wrap = _wrap;
        tabCont = _tabCont;

        _tabCont.id = 'gvik-lastfm';

        gvik.dom.append(_tabCont, [artistInfoCont, trackInfoCont]);
    });


    var np = gvik.dom.create('div', {
        prop: {
            className: 'audio_list'
        },

        style: {
            display: 'none'
        }
    });

    tabCont.appendChild(np);




    if (cnfg.get('lastfm-searchAndPlay')) {

        tabCont.classList.add('searchandplay');


        gvik.dom.setDelegate(tabCont, '.gvikLastfm .img-cont', 'click', function(el, e) {

            e.stopPropagation();
            e.preventDefault();

            e._canceled = true;

            var audioEl = gvik.dom.parent(el, '.gvikLastfm'),

                opt = {
                    maxbit: cnfg.get('lastfm-maxbit')
                },

                _duration = audioEl.getAttribute('data-duration'),
                _track = audioEl.getAttribute('data-trackname'),


                _name = gvik.md5((nameArtist + _track)
                    .toLowerCase()
                    .replace(/\s+/g, '') + _duration),

                curAudio = audoNameCont[_name];


            if (curAudio) {
                if (curAudio == 1) return;
                return playAudioNew(curAudio.owner_id + '_' + curAudio.id);
            }

            gvik.search.audioSearch(nameArtist,
                _track,
                _duration,
                function(result) {

                    if (!result) {
                        audoNameCont[_name] = 1;
                        return;
                    }

                    var audio = ((result.length != null ? result[0] : result) || {}).audio;

                    if (!audio) {
                        audoNameCont[_name] = 1;
                        return;
                    }

                    np.innerHTML = np.innerHTML + drawAudio(audio);
                    audoNameCont[name] = audio;
                    playAudioNew(audio.owner_id + '_' + audio.id);

                }, opt);
        });
    }

    gvik.dom.setDelegate(tabCont, '.gvikLastfm', 'click', function(el, e) {

        e.stopPropagation();
        e.preventDefault();

        var searchName = nameArtist + ' – ' + this.getAttribute('data-trackname');

        if (window.cur.aSearch) {

            cur.searchTypeChanged({
                target: {
                    index: 0
                }
            }, true);

            cur.searchTypeMenu.value = 0;

            Audio.selectPerformer({
                from_pad: false,
                event: 0,
                name: searchName
            });
        } else {
            window.nav.go('audio?q=' + searchName);
        }
    });

}());
