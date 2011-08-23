(function() {
  "use strict";

  var bundle = (typeof exports == "undefined") ? this : exports;

  var imported = (typeof require  == 'undefined') ? this : {
    _:         require('underscore'),
    Backbone:  require('backbone'),
    Slickback: (bundle.Slickback || require('../slickback').Slickback)
  };

  var _         = imported._;
  var Backbone  = imported.Backbone;
  var Slickback = imported.Slickback;

  var CollectionEventsMixin    = Slickback.CollectionEventsMixin;
  var PaginatedCollectionMixin = Slickback.PaginatedCollectionMixin;
  var PagerAdaptorMixin        = Slickback.PagerAdaptorMixin;
  var EventTranslationMixin    = Slickback.EventTranslationMixin;
  var CollectionAdaptorMixin   = Slickback.CollectionAdaptorMixin;

  var exported = Slickback;

  /**
   * NOTE: If extending PaginatedCollection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();
    this.installDataViewAdaptors();

    this.installPaginatedIngestors();

    this.bindCollectionEventTranslations();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               CollectionEventsMixin,
                               PaginatedCollectionMixin,
                               PagerAdaptorMixin,
                               EventTranslationMixin,
                               CollectionAdaptorMixin);

  /**
   * A Backbone.Collection enhanced with pagination and adapted to
   * be used as a Slick.Data.DataView.
   */
  exported.PaginatedCollection = Backbone.Collection.extend(mixin_members);

}).call(this);
