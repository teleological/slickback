(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    Scope = Slickback.Scope;

  var exportNamespace = Slickback;

  /**
   * Construct a default scope for the model or collection, or return
   * the default scope if already constructed.
   */
  var scope = function() {
    return this.defaultScope || (this.defaultScope = new Scope(this));
  };

  /**
   * Extend the default scope associated with a model or collection.
   */
  var extendScope = function(params) {
    var scope = this.scope();
    scope.extend(params);
  };

  /**
   * Clear the parameters of the default scope associated with a model
   * or collection.
   */
  var clearScope = function() {
    this.defaultScope = new Scope(this);
  };

  /**
   * Perform a fetch on a model or collection without applying default
   * scope.
   */
  var fetchWithoutScope = function(options) {
    return this.fetch(options);
  };

  /**
   * Apply the default scope to perform a fetch on a model or collection.
   */
  var fetchWithScope = function(options) {
    return this.scope().fetch(options);
  };

  /**
   * Return a scope for the model or collection, cloned from the
   * default scope.
   */
  var scoped = function(options) {
    var scope = this.scope();
    return scope.scoped(options);
  };

  /**
   * Configure a collection to use scoped fetch by default.
   */
  var installScopedModelDefaults = function() {
    if (! this.defaultScopeEnabled) {
      this.defaultScopeEnabled = true;

      this.fetchWithoutScope = this.fetch;
      this.fetch             = this.fetchWithScope;
    }
  };

  /**
   * Slickback.ScopedModelMixin can be mixed into a model or collection
   * that implements #fetch. It adds a defaultScope member which is accessed
   * via the #scope method, and applied to fetches performed via the
   * #fetchWithScope method.
   */
  exportNamespace.ScopedModelMixin = {
    scope:             scope,
    extendScope:       extendScope,
    clearScope:        clearScope,
    fetchWithoutScope: fetchWithoutScope,
    fetchWithScope:    fetchWithScope,
    scoped:            scoped,
    defaultScopeEnabled:        false,
    installScopedModelDefaults: installScopedModelDefaults
  };

}).call(this);
