goog.provide('ga_fullscreen_directive');

goog.require('ga_browsersniffer_service');
goog.require('ga_permalink');
(function() {

  var module = angular.module('ga_fullscreen_directive', [
    'ga_browsersniffer_service',
    'ga_permalink'
  ]);

  module.directive('gaFullscreen', function($document, gaPermalink,
      gaBrowserSniffer) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaFullscreenMap'
      },
      template: "<a href='#' ng-if='::fullscreenSupported' " +
        "ng-click='click()' translate>full_screen</a>",
      link: function(scope, element, attrs) {
        var fullScreenCssClass = 'ga-full-screen';
        var inputsForbidCssClass = 'ga-full-screen-no-inputs';
        // Use the documentElement element in order to check if the
        // Fullscreen API is usable
        // Documentation about Fullscreen API flavours:
        // https://docs.google.com/spreadsheet/
        //  ccc?key=0AvgmqEgDEiu5dGtqVEUySnBvNkxiYlAtbks1eDFibkE#gid=0
        var doc = $document[0];
        var body = $(doc.body);
        var target = doc.documentElement;
        scope.fullscreenSupported = !!(
          // IE 11 bug when the page is inside an iframe:
          // http://connect.microsoft.com/IE/feedback/details/814527/
          // ie11-iframes-body-offsetwidth-incorrect-when-iframe-is-in
          // -full-screen-mode
          !(gaBrowserSniffer.msie === 11 && gaBrowserSniffer.iframe) &&
            (target.requestFullScreen ||
            target.mozRequestFullScreen ||
            target.webkitRequestFullScreen ||
            target.msRequestFullscreen)
        );

        if (!scope.fullscreenSupported) {
          element.remove();
          return;
        }

        scope.click = function() {
          if (target.requestFullScreen) {
            target.requestFullScreen();
          } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen();
          } else if (target.webkitRequestFullScreen) {
            // Element.ALLOW_KEYBOARD_INPUT allow keyboard input in fullscreen
            // mode, but that doesn't work for Safari
            target.webkitRequestFullScreen((gaBrowserSniffer.safari ?
              0 : Element.ALLOW_KEYBOARD_INPUT));
          } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen();
          }
        };

        var onFullscreenChange = function() {
          body.addClass(fullScreenCssClass);

          // Safari forbids inputs in full screen mode
          // for security reasons
          if (gaBrowserSniffer.safari) {
            body.addClass(inputsForbidCssClass);
          }

          scope.map.updateSize();

          if (!(doc.fullscreenElement ||
              doc.mozFullScreenElement ||
              doc.webkitFullscreenElement ||
              doc.msFullscreenElement)) {
            gaPermalink.refresh();

            body.removeClass(fullScreenCssClass);
            body.removeClass(inputsForbidCssClass);
          }
        };

        $document.on('fullscreenchange mozfullscreenchange ' +
            'webkitfullscreenchange MSFullscreenChange', onFullscreenChange);

        var onKeyDown = function(event) {
          if (event.which === 122) {
            event.preventDefault();
            scope.click(); // From fullscreen API
          }
        };

        // Catch F11 event to provide an HTML5 fullscreen instead of
        // default one
        $document.on('keydown', onKeyDown);

        scope.$on('$destroy', function() {
          $document.off('fullscreenchange mozfullscreenchange ' +
              'webkitfullscreenchange MSFullscreenChange', onFullscreenChange);
          $document.off('keydown', onKeyDown);
          body.removeClass(fullScreenCssClass);
          body.removeClass(inputsForbidCssClass);
        });
      }
    };
  });
})();
