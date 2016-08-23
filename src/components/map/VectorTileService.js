goog.provide('ga_vectortile_service');

goog.require('ga_stylejson_service');
goog.require('ga_styles_service');

(function() {

  var module = angular.module('ga_vectortile_service', [
    'ga_stylejson_service',
    'ga_styles_service'
  ]);

  module.provider('gaVectorTile', function() {
    this.$get = function(gaStyleJson, gaStyleFactory) {

      var vectorTileService = function() {
        this.stylePromises = {};
      };

      vectorTileService.prototype.cloneStyleFunction = function(styleFunction) {
        var clone = {};
        clone.newFunc = styleFunction;
        return clone.newFunc;
      };

      vectorTileService.prototype.highlightFeature = function(layer, feature,
          highlightType) {
        this.unhighlightAllFeatures(layer);
        var styleFunc = this.cloneStyleFunction(layer.getStyleFunction());
        var featureId = feature.getProperties().id;
        layer.defaultVectorStyleFunction = styleFunc;
        layer.setStyle(function(feat, res) {
          if (feat.getProperties().id === featureId) {
            return gaStyleFactory.getStyle(highlightType);
          }
          return styleFunc(feat, res);
        });
      };

      vectorTileService.prototype.unhighlightAllFeatures =
          function(layer) {
        if (layer.defaultVectorStyleFunction) {
          var cloneFunc = this.cloneStyleFunction(
              layer.defaultVectorStyleFunction);
          layer.setStyle(function(feat, res) {
            return cloneFunc(feat, res);
          });
          layer.defaultVectorStyleFunction = null;
        }
      };

      vectorTileService.prototype.setLayerJsonStyle =
          function(layer, styleUrl) {
        if (!this.stylePromises[layer.bodId]) {
          var styleJson = new gaStyleJson();
          this.stylePromises[layer.bodId] = styleJson;
        }
        var that = this;
        this.stylePromises[layer.bodId].get(styleUrl).then(
            function(olStyleForVector) {
          if (olStyleForVector) {
            layer.styleUrl = styleUrl;
            var styleFunc = function(feat, res) {
              return [olStyleForVector.getFeatureStyle(feat, res)];
            };
            layer.setStyle(styleFunc);
            var cloneFunc = that.cloneStyleFunction(styleFunc);
            layer.defaultVectorStyleFunction = cloneFunc;
          }
        });
      };
      var vectorTileInstance = new vectorTileService();

      return vectorTileInstance;
    };
  });
})();
