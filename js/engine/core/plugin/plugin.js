/**
	@author Gerasimov Ruslan
 */


GViK( function( appData, require, add ) {

	var chrome = require( 'chrome' );
	var core = require( 'core' );
	var events = require( 'events' );

	var pluginManage = require( 'pluginManage' );

	var _pluginInfo = [
		'id',
		'uniqName',

		'author',
		'version',
		'name',
		'shortName',
		'homepage',
		'options',
		'events',
		'actions'
	];

	var index = 0;

	var Plugin = function Plugin( pluginInfo ) {

		index++;

		if ( pluginInfo && core.isPlainObject( pluginInfo ) ) {
			core.each( pluginInfo, function( val, key ) {
				if ( _pluginInfo.indexOf( key ) !== -1 ) {
					this[ key ] = val;
				}
			}, this );
		}

		if ( core.isPlainObject( this.events ) ) {

			this._prefixEvents = 'plugin' + this.getUniqKey();

			events.bind( this._prefixEvents + '_disable', this.events.onDisable )
				.bind( this._prefixEvents + '_enable', this.events.onEnable )
				.bind( this._prefixEvents + '_init', this.events.onInit );
		}

		pluginManage.add( this );
	};

	Plugin.prototype.init = function() {
		if ( typeof this.actions.init === 'function' ) {
			var res = this.actions.init();
		}
		events.trigger( this._prefixEvents + '_init', this );
		return res;
	};

	Plugin.prototype.disable = function() {
		if ( typeof this.actions.disable === 'function' ) {
			var res = this.actions.disable();
		}
		events.trigger( this._prefixEvents + '_disable', this );
		return res;
	};

	Plugin.prototype.enable = function() {
		if ( typeof this.actions.enable === 'function' ) {
			var res = this.actions.enable();
		}
		events.trigger( this._prefixEvents + '_enable', this );
		return res;
	};

	Plugin.prototype.isActive = function() {
		return true;
	};

	Plugin.prototype.getUniqKey = function() {
		return 'Plugin' + index;
	};


	add( 'Plugin', Plugin, true );
} );