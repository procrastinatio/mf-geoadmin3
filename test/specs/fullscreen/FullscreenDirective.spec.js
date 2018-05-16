/* eslint-disable max-len */
describe('ga_fullscreen_directive', function() {

  describe('gaFullscreen', function() {
    var elt, scope, parentScope, $compile, $rootScope, $httpBackend, $timeout, $document, map;
    var gaPermalink, gaBrowserSniffer;

    var loadDirective = function(map) {
      parentScope = $rootScope.$new();
      parentScope.map = map;
      var tpl = '<div ga-fullscreen ga-fullscreen-map="map"></div>';
      elt = $compile(tpl)(parentScope);
      $(document.body).append(elt);
      $rootScope.$digest();
      scope = elt.isolateScope();
      $timeout.flush();
    };

    var provideServices = function($provide) {
      // block loading of layersConfig
      $provide.value('gaLayers', {});
    };

    var injectServices = function($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $document = $injector.get('$document');
      gaPermalink = $injector.get('gaPermalink');
      gaBrowserSniffer = $injector.get('gaBrowserSniffer');
    };

    beforeEach(function() {

      module(function($provide) {
        provideServices($provide);
      });

      map = new ol.Map({
        view: new ol.View({
          center: [0, 0]
        })
      });
    });

    afterEach(function() {
      elt.remove();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      try {
        $timeout.verifyNoPendingTasks();
      } catch (e) {
        $timeout.flush();
      }
    });

    describe('on ie 11 inside an iframe', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        gaBrowserSniffer.msie = 11;
        gaBrowserSniffer.iframe = 11;
      });

      it('verifies html elements', function() {
        loadDirective(map);
        expect(elt.find('a').length).to.be(0);
      });

      it('set scope values', function() {
        var spy = sinon.spy($document, 'on');
        loadDirective(map);
        expect(scope).to.be()
      });
    });

    [
      'requestFullScreen',
      'mozRequestFullScreen',
      'webkitRequestFullScreen',
      'msRequestFullscreen'
    ].forEach(function(method) {

      describe('on browser supporting method ' + method, function() {

        beforeEach(function() {
          inject(function($injector) {
            injectServices($injector);
          });
          $document[0].documentElement[method] = function() {};
        });

        afterEach(function() {
          $document[0].documentElement[method] = undefined;
        });

        it('verifies html elements', function() {
          loadDirective(map);
          expect(elt.html()).to.be('<!-- ngIf: ::fullscreenSupported --><a href="#" ng-if="::fullscreenSupported" ng-click="click()" translate="" class="ng-scope">full_screen</a><!-- end ngIf: ::fullscreenSupported -->');
        });

        it('set scope values', function() {
          var spy = sinon.spy($document, 'on'); ;
          loadDirective(map);
          expect(scope.fullscreenSupported).to.be(true);
          expect(scope.click).to.be.a(Function);
          expect(spy.withArgs('fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange').callCount).to.be(1);
          expect(spy.withArgs('keydown').callCount).to.be(1);
          expect($(document.body).hasClass('ga-full-screen')).to.be(false);
          expect($(document.body).hasClass('ga-full-screen-no-inputs')).to.be(false);
        });

        it('#click()', function() {
          var spy = sinon.spy($document[0].documentElement, method);
          loadDirective(map);
          scope.click();
          if (/^webkit/.test(method)) {
            expect(spy.withArgs(0).callCount).to.be(1)
          }
          expect(spy.callCount).to.be(1);
        });

        describe('listens on FullscreenChange event', function() {
          [
            'fullscreenElement',
            'mozFullScreenElement',
            // We can't test this elt, phantom js always transforms it to null
            // 'webkitFullscreenElement',
            'msFullscreenElement'
          ].forEach(function(fsElt) {

            it('toggles fullscreen mode using ' + fsElt, function() {
              var body = $($document[0].body);
              loadDirective(map);
              var spy = sinon.spy(scope.map, 'updateSize');
              var spy2 = sinon.spy(gaPermalink, 'refresh');
              $document[0][fsElt] = {};
              $(document).trigger('fullscreenchange');
              expect(body.hasClass('ga-full-screen')).to.be(true);
              expect(body.hasClass('ga-full-screen-no-inputs')).to.be(true);
              expect(spy.callCount).to.be(1);
              expect(spy2.callCount).to.be(0);

              $document[0][fsElt] = undefined;
              $document.trigger('fullscreenchange');
              expect(body.hasClass('ga-full-screen')).to.be(false);
              expect(body.hasClass('ga-full-screen-no-inputs')).to.be(false);
              expect(spy.callCount).to.be(2);
              expect(spy2.callCount).to.be(1);
            });
          });
        });

        describe('listens on keydown event', function() {

          it('triggers a click when the key is F11', function() {
            loadDirective(map);
            var evt = $.Event('keydown', {
              which: 122
            });
            var evt2 = $.Event('keydown', {
              which: 34
            });
            var spy = sinon.spy(scope, 'click');
            var spy2 = sinon.spy(evt, 'preventDefault');

            $(document).trigger(evt);
            expect(spy.callCount).to.be(1);
            expect(spy2.callCount).to.be(1);

            $(document).trigger(evt2);
            expect(spy.callCount).to.be(1);
            expect(spy2.callCount).to.be(1);
          });
        });

        it('cleans the scope on $destroy event', function() {
          loadDirective(map);
          var body = $($document[0].body);
          var spy = sinon.spy($document, 'off');
          scope.$destroy();
          expect(spy.callCount).to.be(2);
          expect(body.hasClass('ga-full-screen')).to.be(false);
          expect(body.hasClass('ga-full-screen-no-inputs')).to.be(false);
        });
      });
    });

    describe('on webkit but not safari', function() {

      beforeEach(function() {
        inject(function($injector) {
          injectServices($injector);
        });
        gaBrowserSniffer.safari = false;
        $document[0].documentElement['webkitRequestFullScreen'] = function() {};
      });

      it('#click()', function() {
        var spy = sinon.spy($document[0].documentElement, 'webkitRequestFullScreen').withArgs(Element.ALLOW_KEYBOARD_INPUT);
        loadDirective(map);
        scope.click();
        expect(spy.callCount).to.be(1);
      });

      describe('listens on FullscreenChange event', function() {
        var fsElt = 'fullscreenElement';

        it('toggles fullscreen mode using ' + fsElt, function() {
          var body = $($document[0].body);
          loadDirective(map);
          expect(body.hasClass('ga-full-screen-no-inputs')).to.be(false);

          $document[0][fsElt] = {};
          $(document).trigger('fullscreenchange');
          expect(body.hasClass('ga-full-screen-no-inputs')).to.be(false);

          $document[0][fsElt] = undefined;
          $document.trigger('fullscreenchange');
          expect(body.hasClass('ga-full-screen-no-inputs')).to.be(false);
        });
      });
    });

  });
});
