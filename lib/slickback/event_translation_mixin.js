(function() {
  "use strict";

  var bundle = (typeof exports == "undefined") ? this : exports;

  var imported = (typeof require  == 'undefined') ? this : {
    Slickback: (bundle.Slickback || require('../slickback').Slickback)
  };

  var Slickback = imported.Slickback;

  var exported = Slickback;

  var notifyCollectionChanged = function() {
    if (this.getPagingInfo) {
      this.onPagingInfoChanged.notify(this.getPagingInfo());
    }
    this.onRowCountChanged.notify();
    this.onRowsChanged.notify();
  };

  /**
   * Activates event translation for an instance.
   */
  var bindCollectionEventTranslations = function() {
    this.bind("reset",notifyCollectionChanged);
    this.bind("add",notifyCollectionChanged);
    this.bind("remove",notifyCollectionChanged);
  };

  /**
   * Adapts a collection which supports Backbone-style events
   * (e.g. Backbone.Events #bind) and Slick.Data.DataView-style events
   * (e.g. ModelEventsMixin onRowsChanged), translating Backbone
   * "reset", "add" and "remove" events into "onRowCountChanged" and
   * "onRowsChanged" notifications. If #getPagingInfo is implemented
   * (e.g. PagerAdaptorMixin), also publishes "onPagingInfoChanged".
   *
   * Note that unlike the Slick.Grid examples, the onRowCountChanged
   * notification does not include the previous count of rows and the
   * onRowsChanged notification does not include the difference in rows.
   */
  exported.EventTranslationMixin = {
    bindCollectionEventTranslations: bindCollectionEventTranslations
  };

}).call(this);
