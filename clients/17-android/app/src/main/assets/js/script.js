'use strict';

function test() {
  document.body.onclick = function() {
    if(!window.jQuery) {
      Android.showDialog('Hello from WebView!\nThis site does not use jQuery!');
      return;
    }
    var h1 = jQuery('h1');
    Android.showDialog('Hello from WebView!\nNews title:\n' + h1.html());
  };

}