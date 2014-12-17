/*



 */



_GViK.Init( function( gvik, require ) {

    "use strict";

    var core = require( 'core' );

    function Configs() {
        this.defaultConfigs = JSON.parse( core.getResource( 'configs.json' ) );
        this.configs = {};
        this.load();
    }

    Configs.prototype.load = function( opt ) {
        this.configs = {};
        opt = opt || {};
        core.each( this.defaultConfigs, function( defcnfg, namespace ) {
            this.configs[ namespace ] = core.extend( defcnfg, ( opt[ namespace ] || {} ) );
        }.bind( this ) );
        return this.configs;
    };



    Configs.prototype.get = function( namespace, key ) {
        var namespaceVal = this.configs[ namespace ],
            _get = function( k ) {
                return namespaceVal.hasOwnProperty( k ) ?
                    namespaceVal[ k ] :
                    null;
            };

        if ( !namespaceVal ) {
            return null;
        }

        if ( !key ) {
            return {
                get: _get
            };
        }

        return _get( key );

    };


    Configs.prototype.set = function( namespace, key, val ) {
        var curOpt;

        if ( ( curOpt = this.configs[ namespace ] ) ) {

            curOpt[ key ] = val;

            curOpt._sys = {};
            curOpt._sys.lastSaved = Date.now();


            this.configs[ namespace ] = curOpt;
            return true;
        }

        return false;

    };



    _GViK.Add( 'configs', new Configs() );


} );