goog.provide('ga_stylejson_service');

goog.require('ga_stylesfromliterals_service');

(function() {

  var module = angular.module('ga_stylejson_service', [
    'ga_stylesfromliterals_service'
  ]);

  module.provider('gaStyleJson', function() {
    this.$get = function($http, $q, gaStylesFromLiterals) {

      var StyleJson = function() {
        this.deferred = null;

        this.get = function(url) {
          var that = this;
          if (this.deferred) {
            this.cancel_();
          }
          this.deferred = $q.defer();
          var http = $http.get(location.protocol + url, {
            timeout: this.deferred.promise,
            cache: true
          }).then(function(response) {
            that.deferred.resolve(gaStylesFromLiterals(response.data));
          });
          return this.deferred.promise;
        };

        this.cancel_ = function() {
          this.deferred.resolve();
          this.deferred = null;
        };
      };
      return StyleJson;
    };
  });
})();

