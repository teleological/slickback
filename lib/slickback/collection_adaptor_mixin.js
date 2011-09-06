(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace  = Slickback;

  /**
   *  SlickGrid v1.4.3 borrows these methods without binding them.
   */
  var installDataViewAdaptors = function() {
    var that = this;
    this.getLength = function()  { return that.models.length; };
    this.getItem   = function(i) { return that.models[i];     };
  };

  /**
   * Adapts a collection that stores its models in a model array
   * (e.g. Backbone.Collection) for use with SlickGrid v1.4.3.
   * #installDataViewAdaptors must be invoked on each instance.
   */
  exportNamespace.CollectionAdaptorMixin = {
    installDataViewAdaptors: installDataViewAdaptors
  };

}).call(this);
