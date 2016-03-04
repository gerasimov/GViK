/*

<<<<<<< HEAD
GViK( function( gvik, require, Add ) {

  'use strict';

  var core = require( 'core' );

  function Options() {

    this.defaultOptions = {
      'audio': {

        'add-bit': true,
        'add-but': true,

        'auto-load-bit': true,
        'auto-sort-bit': false,
        'auto-hide-bit': false,

        'bitrate-audio': true,
        'bitrate-downloadBtn': false,
        'bitrate-playBtn': false,

        'download-enable': true,
        'download-fromCache': false,
        'download-saveAs': false,

        'file-size': false,

        'format-filename': '%a - %t',

        'shortcut': true,

        'loader-disable': false,
        'min-bitrate': 256,
        'out-hide': false
      },

      'im': {
        'mark-read': false,
        'send-notify': false
      },

      'wall': {
        'disable-wide': false
      },

      'common': {
        'remove-ads': true,
        'remove-white-heart': true,
        'set-offline': true,
        'set-online': false,
        'state-onlineChange': false
      },
      'groups': {
        'fast-exit': true
      },

      'lastfm': {
        'enable': true,
        'disable-repeatScrobble': false,
        'percent': 50,
        'disable-russian': false,
        'update-nowplaying': true
      },
      'sidebar': {
        'animation': false,
        'enable': false,
        'faves': true,
        'friends': false,
        'friendsfaves-module': true,
        'lastfm-module': true,
        'hide-offline': false,
        'open-ajax': false,
        'open-cur': false,
        'open-newTab': true,
        'lastfm-searchAndPlay': true,
        'lastfm-maxbit': false,
        'lastfm-groupbyalbum': false,
        'lastfm-autoshow': false
      },
      'system': {
        'enable-qicksett': true
      },
      'video': {
        'download-enable': true
      },
      'vkapi': {
        'offline': true
      }
    };

    this.load();
  }

  Options.prototype.load = function( opt ) {
    this.options = {};
    opt = opt || {};
    core.each( this.defaultOptions, function( defcnfg, namespace ) {
      this.options[ namespace ] = core.extend( defcnfg, ( opt[ namespace ] || {} ) );
    }.bind( this ) );
    return this.options;
  };

  Options.prototype.get = function( namespace, key ) {
    var namespaceVal = this.options[ namespace ];

    var _get = function( k ) {
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
=======


 */

GViK(function(gvik, require, Add) {

    'use strict';

    var core = require('core');

    function Options() {

        this.defaultOptions = {
            'audio': {

                'add-bit': true,
                'add-but': true,

                'auto-load-bit': true,
                'auto-sort-bit': false,
                'auto-hide-bit': false,

                'bitrate-audio': true,
                'bitrate-downloadBtn': false,
                'bitrate-playBtn': false,

                'download-enable': true,
                'download-fromCache': false,
                'download-saveAs': false,

                'file-size': false,

                'format-filename': '%a - %t',

                'shortcut': true,

                'loader-disable': false,
                'min-bitrate': 256,
                'out-hide': false
            },

            'im': {
                'mark-read': false,
                'send-notify': false
            },

            'wall': {
                'disable-wide': false
            },

            'common': {
                'remove-ads': true,
                'remove-white-heart': true,
                'set-offline': true,
                'set-online': false,
                'state-onlineChange': false
            },
            'groups': {
                'fast-exit': true
            },

            'lastfm': {
                'enable': true,
                'disable-repeatScrobble': false,
                'percent': 50,
                'disable-russian': false,
                'update-nowplaying': true
            },
            'sidebar': {
                'animation': false,
                'enable': false,
                'faves': true,
                'friends': false,
                'friendsfaves-module': true,
                'lastfm-module': true,
                'hide-offline': false,
                'open-ajax': false,
                'open-cur': false,
                'open-newTab': true,
                'lastfm-searchAndPlay': true,
                'lastfm-maxbit': false,
                'lastfm-groupbyalbum': false,
                'lastfm-autoshow': false
            },
            'system': {
                'enable-qicksett': true
            },
            'video': {
                'download-enable': true
            },
            'vkapi': {
                'offline': false
            }
        };

        this.load();
    }

    Options.prototype.load = function(opt) {
        this.options = {};
        opt = opt || {};
        core.each(this.defaultOptions, function(defcnfg, namespace) {
            this.options[ namespace ] = core.extend(defcnfg, (opt[ namespace ] || {}));
        }.bind(this));
        return this.options;
    };

    Options.prototype.get = function(namespace, key) {
        var namespaceVal = this.options[ namespace ];

        var _get = function(k) {
            return namespaceVal.hasOwnProperty(k) ?
                namespaceVal[ k ] :
                null;
        };

        if (!namespaceVal) {
            return null;
        }

        if (!key) {
            return {
                get: _get
            };
        }

        return _get(key);

    };

    Options.prototype.set = function(namespace, key, val) {
        var curOpt;

        if ((curOpt = this.options[ namespace ])) {
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

    return _get( key );

  };

<<<<<<< HEAD
  Options.prototype.set = function( namespace, key, val ) {
    var curOpt;

    if ( ( curOpt = this.options[ namespace ] ) ) {
=======
            this.options[ namespace ] = curOpt;
            return true;
        }
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd

      curOpt[ key ] = val;

      curOpt._sys = {};
      curOpt._sys.lastSaved = Date.now();

<<<<<<< HEAD
      this.options[ namespace ] = curOpt;
      return true;
    }

    return false;

  };

  Options.prototype.save = function() {
    if ( require( 'chrome' ) ) {
      require( 'chrome' ).local.set( 'options', this.options, function() {} );
      return true;
    }
  };

  Add( 'options', new Options() );

} );
=======
    Options.prototype.save = function() {
        if (require('chrome')) {
            require('chrome').local.set('options', this.options, function() {});
            return true;
        }
    };

    Add('options', new Options());

});
>>>>>>> 2ef21ba6fd9d858273a7b0b05fc6778e3cc132bd
