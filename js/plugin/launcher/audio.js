/**
 *
 *
 *
 */

GViKModule.Check( {}, [
		'launcher'
	],

	function( gvik ) {


		var TMPL = {
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


		function secToTime( sec ) {
			var result = [],

				hours = ( '00' + ( ( sec / 3600 % 3600 ) | 0 ) )
				.slice( -2 ),
				mins = ( '00' + ( ( ( sec / 60 ) % 60 ) | 0 ) )
				.slice( -2 ),
				secs = ( '00' + ( sec % 60 ) )
				.slice( -2 );

			if ( hours !== '00' ) {
				result.push( hours );
			}
			result.push( mins );
			result.push( secs );

			return result.join( ':' );
		}

		function drawAudio( audio, callback ) {

			var _drawAudio = function( audio ) {
				return rs( TMPL.audio, {
					audio_id: audio[ 0 ] + '_' + audio[ 1 ],
					performer: audio[ 5 ],
					title: audio[ 6 ],
					url: audio[ 2 ],
					playtime: audio[ 3 ],
					duration: audio[ 4 ]
				} );
			};


			return _drawAudio( [
				audio.owner_id,
				audio.id,
				audio.url,
				audio.duration,
				secToTime( audio.duration ),
				audio.artist,
				audio.title,
				0,
				0,
				1
			] );
		}

		var trackContainer = gvik.dom.create( 'div', {
			style: {
				display: 'none'
			}
		} );

		gvik.dom.appendBody( trackContainer );

		gvik.launcher.add( 'search', function( searchData ) {

			gvik.search.audioSearch( searchData, function( result ) {

				if ( !result ) {
					return;
				}

				var audioData = ( result.length != null ) ?
					result[ 0 ] :
					result;


				if ( !audioData )
					return;


				var audio = audioData.audio || audioData,

					audioHTML = drawAudio( audio );

				trackContainer.innerHTML += audioHTML;

				window.playAudioNew( audio.owner_id + '_' + audio.id );

			}.bind( this ), {} );
		} );

		gvik.launcher.on( 'LAUNCHER_enter', function( q ) {
			this.search( {
				q: q
			} )
		} );

	} );