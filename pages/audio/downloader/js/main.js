/*
 
 
 
 
 */

GViK( function( appData, require ) {


	var dom = require( 'dom' ),
		core = require( 'core' ),
		vkapi = require( 'vkapi' ),
		events = require( 'events' ),
		dom = require( 'dom' );



	events.bind( 'load', function() {



		var al = dom.byClass( 'audios-list' ).item( 0 ),
			ul = al.firstElementChild;


		events.bind( 'audio.get', function( data, evname, scope ) {

			scope.result = scope.result || [];
			scope.index = scope.index || 0;
			scope.lock = scope.lock || false;

			if ( scope.index >= scope.count || scope.lock ) {
				scope.lock = true;
				return;
			}

			if ( !scope.lock ) {
				scope.lock = true;
				vkapi.call( 'audio.get', {
					count: 100,
					offset: scope.index
				}, function( res ) {

					scope.count = scope.count || res.count;
					scope.lock = false;
					scope.result.push.apply( scope.result, res.items );

					ul.innerHTML += core.map( res.items, function( obj ) {

						return core.template( '<li data-index="' + scope.index++ +'" class="audio-item">\
							<div>\
								<div class="artist">{{artist}}</div>\
								<div class="title">{{title}}</div>\
							</div>\
						</li>', /\{\{\w+\}\}/g, [ 2, -2 ], obj );
					} ).join( '' );

				} );
			}

		}, true )

		.bind( 'selectAudio', function( data, evname, $scope ) {

			$scope.artistEl = $scope.artistEl || dom.query( '.cur-track .artist' );
			$scope.titleEl = $scope.titleEl || dom.query( '.cur-track .title' );

			$scope.artistEl.innerText = data.artist;
			$scope.titleEl.innerText = data.title;

			 $("#jquery_jplayer").jPlayer("setMedia", { 
			 	title: data.artist,
       			artist: data.title,
				mp3: data.url
            });

		} )

		dom.setEvent( al, {
			scroll: function() {

				var st = al.scrollTop,
					h = al.offsetHeight,
					oh = ul.offsetHeight;

				if ( ( oh - st - h ) < 150 ) {
					events.trigger( 'audio.get' );
				}

			}
		} );



		dom.setDelegate( al, '.audio-item', {
			click: function( el, e ) {

				events.trigger( 'selectAudio', events.getEvent()[ "audio.get" ].$scope.result[ el.getAttribute( 'data-index' ) ] );

				e.stopPropagation();
				e._canceled = true;
			}
		} )


		$("#jquery_jplayer").jPlayer({
		   swfPath: "http://www.jplayer.org/latest/js/Jplayer.swf",
		    supplied: "mp3",
		    volume: 1,
		    playlistOptions: {
			    autoPlay: true,
			    enableRemoveControls: true
			},
			 wmode:"window",
		    solution: "html,flash",
    		});


	} );


} );