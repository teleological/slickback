(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace  = Slickback;

  var getLength = function() {
    return this.models.length;
  };

  var getItem = function(i) {
    return this.models[i];
  };

  /**
   * Adapts a collection that stores its models in a model array
   * (e.g. Backbone.Collection) for use with SlickGrid v2.0
   */
  exportNamespace.CollectionAdaptorMixin = {
    getLength: getLength,
    getItem:   getItem
  };

}).call(this);
