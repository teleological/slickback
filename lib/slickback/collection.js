(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use                      = Slickback.use,
    CollectionEventsMixin    = Slickback.CollectionEventsMixin,
    EventTranslationMixin    = Slickback.EventTranslationMixin,
    CollectionAdaptorMixin   = Slickback.CollectionAdaptorMixin;

  var imported = use(linkGlobal, [
      { symbol: '_',        module: 'underscore' },
      { symbol: 'Backbone', module: 'backbone'   }
    ]),
    _ = imported._,
    Backbone = imported.Backbone;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending Collection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();
    this.bindCollectionEventTranslations();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               CollectionEventsMixin,
                               EventTranslationMixin,
                               CollectionAdaptorMixin);

  /**
   * A Backbone.Collection adapted to be used as a Slick.Data.DataView.
   */
  exportNamespace.Collection = Backbone.Collection.extend(mixin_members);

}).call(this);
