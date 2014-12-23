/*



 */



_GViK.Init( function( gvik, require ) {

  "use strict";

  var core = require( 'core' );

  function Options() {

    this.defaultOptions = {
      "audio": {

        "add-bit": true,
        "add-but": true,

        "auto-load-bit": true,
        "auto-sort-bit": false,
        "auto-hide-bit": false,

        "bitrate-audio": true,
        "bitrate-downloadBtn": false,
        "bitrate-playBtn": false,

        "download-enable": true,
        "download-fromCache": false,
        "download-saveAs": false,

        "faster": false,
        "file-size": false,

        "format-filename": "%a - %t.%e",

        "loader-disable": false,
        "min-bitrate": 256,
        "out-hide": false
      },
      "common": {
        "mark-red-type-vote": false,
        "remove-ads": true,
        "remove-status": false,
        "remove-white-heart": true,
        "set-offline": true,
        "set-online": false,
        "state-onlineChange": false
      },
      "groups": {
        "fast-exit": true
      },
      "im": {
        "mark-read": false,
        "send-notify": false
      },
      "instagram": {
        "enable": false
      },
      "lastfm": {
        "enable": true,
        "percent": 50
      },
      "sidebar": {
        "animation": false,
        "enable": false,
        "faves": true,
        "friends": false,
        "friendsfaves-module": true,
        "lastfm-module": true,
        "hide-offline": false,
        "open-ajax": false,
        "open-cur": false,
        "open-newTab": true,
        "lastfm-searchAndPlay": true,
        "lastfm-maxbit": false
      },
      "system": {
        "enable-qicksett": true
      },
      "video": {
        "download-enable": true
      },
      "vkapi": {
        "offline": false
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
    var namespaceVal = this.options[ namespace ],
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


  Options.prototype.set = function( namespace, key, val ) {
    var curOpt;

    if ( ( curOpt = this.options[ namespace ] ) ) {

      curOpt[ key ] = val;

      curOpt._sys = {};
      curOpt._sys.lastSaved = Date.now();


      this.options[ namespace ] = curOpt;
      return true;
    }

    return false;

  };



  _GViK.Add( 'options', new Options() );


} );