(function() {
  "use strict";

  var bundle = (typeof exports == "undefined") ? this : exports;

  var imported = (typeof require  == 'undefined') ? this : {
    Slickback: (bundle.Slickback || require('../slickback').Slickback)
  };

  var Slickback = imported.Slickback;

  var exported  = Slickback;

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
  exported.CollectionAdaptorMixin = {
    installDataViewAdaptors: installDataViewAdaptors
  };

}).call(this);
