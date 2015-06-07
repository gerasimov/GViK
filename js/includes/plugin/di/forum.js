GViK( function( appData, require, Add ) {


	var core = require( 'core' ),
		dom = require( 'dom' ),
		chrome = require( 'chrome' ),
		sidebar = require('sidebar');



	function DIFM() {


	}

	var tmpl = '<div class="item">\
			<div class="item-cont">\
				<div class="label-cont">\
					<span class="label">{{TITLE}}</span>\
				</div> \
			</div>\
	</div>',

	page = sidebar.addPage();


	page.tabCont.classList.add('loaded');

 


	DIFM.prototype.get = function() {
		chrome.ajax( {
			url: 'http://forums.di.fm/archive/index.php/f-40.html'
		}, function( html ) {

			var hrefs = html.match( /\<a\shref\=\"http\:\/\/forums\.di\.fm\/archive\/index\.php\/t\-\d+\.html\">.+\<\/a\>/g );

			page.tabCont.innerHTML = hrefs.map( function( link ) {

					var trackInfo = link.match( /\<a\shref\=\"http\:\/\/forums\.di\.fm\/archive\/index\.php\/t\-(\d+)\.html\">(.+)\<\/a\>/ );

					return core.template( tmpl, /\{\{\w+\}\}/gi, [ 2, -2 ], {
						TITLE: trackInfo[ 2 ]
					} );

				} ).join( '' )


		} )
	};



	var difm = new DIFM;

	difm.get();


	Add( 'di', difm )



} );