(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use                      = Slickback.use,
    Collection               = Slickback.Collection,
    PaginatedCollectionMixin = Slickback.PaginatedCollectionMixin,
    PagerAdaptorMixin        = Slickback.PagerAdaptorMixin;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending PaginatedCollection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();

    this.installPaginatedIngestors();

    this.bindCollectionEventTranslations();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               PaginatedCollectionMixin,
                               PagerAdaptorMixin);

  /**
   * A Slickback.Collection enhanced with pagination support.
   */
  exportNamespace.PaginatedCollection = Collection.extend(mixin_members);

}).call(this);
