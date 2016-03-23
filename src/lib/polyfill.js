/* Initially created with the following command
 *
 * Base version: https://cdn.polyfill.io/v2/polyfill.js?features=requestAnimationFrame&ua=MSIE%209.0
 * 
 * Adapted to support other browsers are well (Safari <= 5.1)
 *
 * Minified with closure
*/

(function(undefined) {

// performance.now
(function (global) {

var
startTime = Date.now();

if (!global.performance) {
    global.performance = {};
}

global.performance.now = function () {
    return Date.now() - startTime;
};

}(this));

// requestAnimationFrame
(function (global) {

  if (! ('requestAnimationFrame' in global)) {
    
    if ('mozRequestAnimationFrame' in global) {
      global.requestAnimationFrame = function (callback) {
          return mozRequestAnimationFrame(function () {
              callback(performance.now());
          });
      };
      global.cancelAnimationFrame = mozCancelAnimationFrame;

    } else if ('webkitRequestAnimationFrame' in global) {
      global.requestAnimationFrame = function (callback) {
          return webkitRequestAnimationFrame(function () {
              callback(performance.now());
          });
      };
      global.cancelAnimationFrame = webkitCancelAnimationFrame;

    } else {

      var lastTime = Date.now();

      global.requestAnimationFrame = function (callback) {
        if (typeof callback !== 'function') {
          throw new TypeError(callback + 'is not a function');
        }

        var
        currentTime = Date.now(),
        delay = 16 + lastTime - currentTime;

        if (delay < 0) {
          delay = 0;
        }

        lastTime = currentTime;

        return setTimeout(function () {
          lastTime = Date.now();

          callback(performance.now());
        }, delay);
      };

      global.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }
})(this);

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
