// cross-browser asynchronous script loading for zxcvbn.
// adapted from http://friendlybit.com/js/lazy-loading-asyncronous-javascript/

(function() {

  var ZXCVBN_SRC = 'js/zxcvbn.28ad9d93.js';

  var async_load = function() {
    var first, s;
    s = document.createElement('script');
    s.src = ZXCVBN_SRC;
    s.type = 'text/javascript';
    s.async = true;
    first = document.getElementsByTagName('script')[0];
    return first.parentNode.insertBefore(s, first);
  };

  if (window.attachEvent != null) {
    window.attachEvent('onload', async_load);
  } else {
    window.addEventListener('load', async_load, false);
  }

}).call(this);
