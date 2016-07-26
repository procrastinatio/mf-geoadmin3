goog.provide('ga_help_service');

goog.require('ga_translation_service');

(function() {

  var module = angular.module('ga_help_service', [
    'ga_translation_service'
  ]);

 /**
   * The gaHelp service.
   *
   * The service provides the following functionality:
   *
   * - Allows the gaHelpDirective to get a html snipped
   *   for a given help-id
   */
  module.provider('gaHelp', function() {
    this.$get = function($http, gaLang) {

      var Help = function() {
        var url = 'https://www.googleapis.com/fusiontables/v1/query?' +
                  'callback=JSON_CALLBACK';
        var apiKey = 'AIzaSyDT7wmEx97gAG5OnPwKyz2PnCx3yT4j7C0';
        var sqlTmpl = 'select * from 1Tx2VSM1WHZfDXzf8rweRLG1kd23AA4aw8xnZ_3c' +
                      ' where col0={id} and col5=\'{lang}\'';

        //Returns a promise
        this.get = function(id) {
          var lang = fixLang(gaLang.get());

          //get it from fusion tables
          var sql = sqlTmpl
                    .replace('{id}', id)
                    .replace('{lang}', lang);
          return $http.jsonp(url, {
            cache: true,
            params: {
              key: apiKey,
              sql: sql
            }
          }).then(function(response) {
            return response.data;
          });
        };

        //we only support certain languages
        function fixLang(l) {
          return (l == 'rm') ? 'de' : l;
        }
      };

      return new Help();
    };
  });
})();

