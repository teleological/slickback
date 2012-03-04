(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use = Slickback.use;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _     = imported._,
    Slick = linkGlobal.Slick;
  // NOTE: assuming global linkage for SlickGrid

  if (typeof Slick === "undefined") {
    console.log("Failed to load SlickGrid.");
  }

  var exportNamespace = Slickback;

  var installDataViewEventHandlers = function() {
    this.onRowCountChanged   = new Slick.Event();
    this.onRowsChanged       = new Slick.Event();
    this.onPagingInfoChanged = new Slick.Event();
  };

  /**
   * Adapts a collection to be used as a Slick.Data.DataView
   * for purposes of event subscription and notification.
   * #installDataViewEventHandlers must be invoked on each instance.
   */
  exportNamespace.CollectionEventsMixin = {
    installDataViewEventHandlers: installDataViewEventHandlers
  };

}).call(this);
