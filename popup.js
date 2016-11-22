'use strict';

function onConfig( config ) {
  var $backend = document.querySelector( '#backend' );

  while ( $backend.firstChild ) {
      $backend.removeChild( $backend.firstChild );
  }

  config.backends.forEach( function ( backend ) {
      var $option = document.createElement( 'option' );

      $option.value = backend;
      $option.innerText = backend;
      $backend.appendChild( $option );
  } );

  $backend.selectedIndex = 0;
}

function onStorageData( data ) {
  if ( data.config ) {
    onConfig( data.config );
  }
}

function onUpdate() {
    var state = { action: 'set' },
      $options = Array.from( document.querySelectorAll( '.option' ) );

    $options.forEach( function ( $el ) {
        state[ $el.id ] = $el.checked !== undefined
          ? $el.checked
          : $el.value;
    } );

    chrome.runtime.sendMessage( state );
}

function refreshState( state ) {
    var $options = Array.from( document.querySelectorAll( '.option' ) );

    $options.forEach( function ( $el ) {
        var value = state[ $el.id ];

        if ( typeof value === 'boolean' ) {
            $el.checked = value;
        } else if ( value !== null ) {
            $el.value = value;
        }

        $el.addEventListener( 'change', onUpdate, false );
    } );

    document.body.className = '';
}

window.addEventListener( 'load', function () {
  chrome.runtime.sendMessage( { action: 'get' }, refreshState );
} );

chrome.storage.local.get( 'config', onStorageData );

chrome.storage.onChanged.addListener( onStorageData );
