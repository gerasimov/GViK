/*
 
 */

GViK( function( appData, require, add ) {


	var core = require( 'core' );
	var dom = require( 'dom' );

	dom.append( document.head, dom.create( 'style', {
		prop: {
			type: 'text/css',
			innerHTML: core.map( [
				'[id^="post<%=id>_"]',
				'[id^="chat_tab_icon_<%=id>"]',
				'[id^="ts_contact<%=id>"]',
				'[id^="user_block<%=id>"]',
				'[id="im_dialog<%=id>"]',
				'[onclick*="<%=id>"]',
				'[href*="<%=id>"]'
			], function( pattern ) {
				return core.map( [], function( blockId ) {
					return core.tmpl( pattern, {
						id: blockId
					} );
				} ).join( ',\n' )
			} ).join( ',\n' ) + ' {\ndisplay: none!important;\n}'
		}
	} ) );
} );