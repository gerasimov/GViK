/*
 
 
 
 */

_GViK( function( gvik, require, Add ) {

  "use strict";



  var methods = window.methods = {},

    core = require( 'core' ),
    event = require( 'event' ),
    chrome = window.chrome;

  function eachTabs( callback, needAll ) {
    chrome.tabs.query( {
      url: '*://vk.com/*'
    }, function( tabs ) {

      chrome.tabs.query( {
        url: chrome.extension.getURL( '' ) + '*'
      }, function( _tabs ) {
        tabs = tabs.concat( _tabs );

        if ( needAll ) {
          callback( tabs );
        } else {
          core.each( tabs, callback );
        }

      } );
    } );
  }

  function sendMessageEx( suc, arg, type, senderId ) {
    eachTabs( function( tab ) {

      if ( type === 0 && ( tab.id == senderId ) )
        return;
      else if ( type === 1 && tab.id !== senderId )
        return;

      chrome.tabs.sendMessage( tab.id, {
        callback: suc,
        arg: arg
      } );
    } );
  }

  methods.triggerEvent = function( o, p, c ) {
    if ( event )
      event.trigger( o.ev, o.dt );
  };

  methods.getSupport = function( o, p, c ) {
    c( window.SUPPORT || {} );
  };

  if ( SUPPORT.tabs ) {



    methods.tabsOpen = function( obj, params, callback ) {

      if ( !params.orUpd ) {
        return chrome.tabs.create( obj, callback );
      }

      chrome.tabs.query( {
        windowType: 'normal',
        url: obj.url
      }, function( tabs ) {

        if ( !tabs.length ) {
          return chrome.tabs.create( obj, callback );
        }

        chrome.tabs.update( tabs[ 0 ].id, {
          active: true
        }, callback );

      } );
    };


    methods.sendTabs = function( o, p ) {
      sendMessageEx( p.eventName, [ o ], p.needCur, p.tabId );
    };

  }

  if ( SUPPORT.windows ) {
    var winOpened = false,
      winId;

    methods.auth = function( obj, params, callback, error ) {

      if ( winOpened ) {
        chrome.windows.update( winId, {
          focused: true
        } );
        return;
      }

      var token;

      chrome.windows.create( core.extend( {
        type: 'popup',
        focused: true
      }, obj ), function( createdWin ) {
        winId = createdWin.id;
        winOpened = true;

        var unBind = function( winid ) {
          if ( winid === createdWin.id ) {
            chrome.tabs.onUpdated.removeListener( updateWin );
            chrome.windows.onRemoved.removeListener( unBind );
            winOpened = false;
          }
        };

        var updateWin = function( tid, tabInfo ) {

          if ( createdWin.tabs[ 0 ].id != tid || !tabInfo || !tabInfo.url ) {
            return;
          }

          if ( /error\=/.test( tabInfo.url ) ) {
            error( tabInfo.url );
            return chrome.windows.remove( createdWin.id );
          }

          if ( ( token = tabInfo.url.match( /token\=(.[^&]+)/ ) ) ) {
            callback( token[ 1 ], tabInfo.url );
            return chrome.windows.remove( createdWin.id );
          }
        };

        chrome.windows.onRemoved.addListener( unBind );
        chrome.tabs.onUpdated.addListener( updateWin );
      } );
    };
  }

  methods.tabId = function( o, p, c ) {
    c( p.tabId );
  };

  if ( SUPPORT.downloads ) {

    chrome.downloads.onChanged.addListener( function( downProp ) {
      sendMessageEx( "donwloadChanged", [ downProp ] );
    } );

    methods.download = function( o, p, c ) {
      chrome.downloads.download( o, c );
    };

    methods.search = function( o, p, c ) {
      chrome.downloads.search( o, c );
    };

    methods.setShelfEnabled = function( o, p, c ) {
      chrome.downloads.setShelfEnabled( o.state );
    };

    methods.downloadFromCache = function( o, p, c ) {
      var xhr = new XMLHttpRequest(),
        i = 0,
        ready = false,
        urlmng = ( window.URL || window.webkitURL ),
        url = o.url,
        fromCache = false;

      xhr.responseType = 'blob';
      xhr.addEventListener( 'progress', function( data ) {


        if ( ready )
          return;

        i++;

        if ( i >= 2 ) {

          if ( data.loaded === data.total ) {
            o.url = urlmng.createObjectURL( xhr.response );
            fromCache = true;
          }

          ready = true;

          chrome.downloads.download( o, function() {
            if ( fromCache ) {
              urlmng.revokeObjectURL( url );
            }
            c.apply( this, arguments );
          } );

          xhr.abort();
        }
      }, false );
      xhr.open( 'GET', o.url, true );
      xhr.send();
    };
  }


  if ( SUPPORT.storage ) {

    methods.setSync = function( o, p, c ) {
      chrome.storage.sync.set( o, c );
    };

    methods.getSync = function( o, p, c ) {
      chrome.storage.sync.get( o.key, c );
    };

    methods.removeSync = function( o, p ) {
      chrome.storage.sync.remove( o.key );
    };

    methods.setLocal = function( o, p, c ) {
      chrome.storage.local.set( o, c );
    };

    methods.getLocal = function( o, p, c ) {
      chrome.storage.local.get( o.key, c );
    };

    methods.removeLocal = function( o, p ) {
      chrome.storage.local.remove( o.key );
    };
  }

  if ( SUPPORT.nativeMessaging ) {
    methods.sendNativeMessage = function( o, p, c, e ) {
      chrome.runtime.sendNativeMessage( o.name, o.val, c );
    };
  }

  methods.simpleAjax = methods.ajax = function( o, p, c, e ) {
    core.ajax( o, c, e );
  };

  methods.abortAjax = function( o, p, c, e ) {
    core.abortXHR( o.xhrId, c );
  };

  methods.abortAllAjax = function( o, p, c, e ) {

    core.abortAllXHR( c );
  };



  if ( SUPPORT.pageAction ) {
    methods.showPageAction = function( o, p ) {
      chrome.pageAction.show( p.tabId );
    };
  }

  methods.ga = function( o, p, c ) {
    if ( window.ga ) {
      window.ga.apply( this, o.arg );
    }
  };


  methods.pushID = function( o, p, c, e ) {

    var ids = [];

    if ( localStorage.ids )
      ids = localStorage.ids.split( ',' );

    localStorage.curId = p.uid;

    if ( ids.indexOf( p.uid + '' ) !== -1 )
      return;

    ids.push( p.uid );

    localStorage.ids = ids.toString();

  };

} );