goog.provide('olcs.GaKmlSynchronizer');
goog.require('olcs.AbstractSynchronizer');


/**
 * Unidirectionally synchronize geoadmin kml layers to Cesium.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.DataSourceCollection} dataSources
 * @constructor
 * @extends {olcs.AbstractSynchronizer}
 * @api
 * @struct
 */
olcs.GaKmlSynchronizer = function(map, scene, dataSources) {

  /**
   * @protected
   */
  this.dataSources_ = dataSources;

  goog.base(this, map, scene);
};
goog.inherits(olcs.GaKmlSynchronizer, olcs.AbstractSynchronizer);


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.createSingleLayerCounterparts =
    function(olLayer) {

  var dsP;
  var factory = olcs.obj(olLayer)['getCesiumDataSource'];
  
  if (factory) {
    dsP = factory(this.scene);
    if (!dsP) {
      return null;
    }
  } else {
    var url = olLayer.get('url');
    if (olLayer.get('type') != 'KML' || !url || /:\/\/public\./.test(url)) {
      return null;
    }
    var proxy = olLayer.getSource().get('olcs.proxy');
    proxy = (proxy) ? new Cesium.DefaultProxy(proxy): null;

    dsP = Cesium.KmlDataSource.load(url, {
      camera: this.scene.camera,
      canvas: this.scene.canvas,
      proxy: proxy
    });
  }
  
  dsP.then(function(ds) {
    ds.show = olLayer.getVisible();
    olLayer.on('change:visible', function(evt) {
      ds.show = evt.target.getVisible();
    });
  });

  return [dsP];
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.addCesiumObject = function(dsP) {
  this.dataSources_.add(dsP);
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.destroyCesiumObject = function(dsP) {
  var that = this;
  dsP.then(function(ds) {
    that.dataSources_.remove(ds, true);
  });
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.removeSingleCesiumObject =
    function(dsP, destroy) {
  var that = this;
  dsP.then(function(ds) {
    that.dataSources_.remove(ds, destroy);
  });
};


/**
 * @inheritDoc
 */
olcs.GaKmlSynchronizer.prototype.removeAllCesiumObjects = function(destroy) {
  this.dataSources_.removeAll(destroy);
};

