(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use              = Slickback.use,
    Collection       = Slickback.Collection,
    ScopedModelMixin = Slickback.ScopedModelMixin;

  var imported = use(linkGlobal, [
      { symbol: '_',        module: 'underscore' },
      { symbol: 'Backbone', module: 'backbone'   }
    ]),
    _        = imported._,
    Backbone = imported.Backbone;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending Collection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();
    this.bindCollectionEventTranslations();

    this.installScopedModelDefaults();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               ScopedModelMixin);

  /**
   * A Backbone.Collection, extended with default scope,
   * adapted to be used as a Slick.Data.DataView.
   */
  exportNamespace.ScopedCollection = Collection.extend(mixin_members);

}).call(this);
