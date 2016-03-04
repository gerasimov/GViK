/*
	@author Gerasimov Ruslan
 */

GViK( function( appData, require, add ) {


	var core = require( 'core' );
	var chrome = require( 'chrome' );

	var PluginManager = function() {
		this.plugins = {};
	};

	PluginManager.prototype.getActivePlugins = function() {
		return core.filter( this.plugins, function( plugin ) {
			return plugin.isActive();
		} )
	};

	PluginManager.prototype.getUnactivePlugins = function() {
		return core.filter( this.plugins, function( plugin ) {
			return !plugin.isActive();
		} )
	};

	PluginManager.prototype.init = function() {
		core.each( this.getActivePlugins(), function( plugin ) {
			plugin.init();
		} );
	};

	PluginManager.prototype.add = function( plugin ) {
		this.plugins[ plugin.getUniqKey() ] = plugin;
	};

	PluginManager.prototype.getById = function( pluginId ) {
		return this.plugins[ pluginId ];
	};

	PluginManager.prototype.disableById = function( pluginId ) {
		var plugin = this.getById( pluginId );
		if ( plugin ) {
			return plugin.disable();
		}
		return false;
	};

	PluginManager.prototype.enableById = function( pluginId ) {
		var plugin = this.getById( pluginId );
		if ( plugin ) {
			return plugin.enable();
		}
		return false;
	};

	PluginManager.prototype.initById = function( pluginId ) {
		var plugin = this.getById( pluginId );
		if ( plugin ) {
			return plugin.init();
		}
		return false;
	};

	PluginManager.prototype.initAll = function() {
		core.each( this.getActivePlugins(), function( plugin ) {
			plugin.init();
		} );
	};

	PluginManager.prototype.disableAll = function() {
		core.each( this.getActivePlugins(), function( plugin ) {
			plugin.disable();
		} );
	};

	PluginManager.prototype.enableAll = function() {
		core.each( this.getActivePlugins(), function( plugin ) {
			plugin.enable();
		} );
	};

	PluginManager.prototype.getSettings = function() {
		return core.toObject( core.map( this.plugins, function( plugin ) {
			return [ plugin.getUniqKey(), plugin.isActive() ];
		} ) );
	};

	add( 'pluginManage', new PluginManager() );

} );