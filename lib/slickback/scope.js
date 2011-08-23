(function() {
  "use strict";

  var bundle = (typeof exports == "undefined") ? this : exports;

  var imported = (typeof require  == 'undefined') ? this : {
    _:         require('underscore'),
    Slickback: (bundle.Slickback || require('../slickback').Slickback)
  };

  var _         = imported._;
  var Slickback = imported.Slickback;

  var exported = Slickback;

  /**
   * Slickback.Scope constructs scope objects that wrap a model
   * or collection to encapsulate a set of parameters to be used
   * to fetch the model or collection.
   */
  function Scope(model,dataOptions) {
    if (! this instanceof Scope) {
      return new Scope(model,dataOptions);
    }
    this.model       = model;
    this.dataOptions = dataOptions || {};
    return this;
  }

  /**
   * Fetch from model or collection, applying scope parameters.
   * Assumes model/collection has a #fetch method which accepts
   * an options object.
   */
  var fetch = function(fetchOptions) {
    var optionsWithScope = this.makeFetchOptions(fetchOptions);
    return (! _.isUndefined(this.model.fetchWithoutScope)) ?
      this.model.fetchWithoutScope(optionsWithScope) :
      this.model.fetch(optionsWithScope);
  };

  /**
   * Merge the data object (if any) of the passed options object
   * with the scope parameters. Values in the passed data object
   * take precedence over those set in the scope. A new options
   * object is returned including a data object which is the
   * result of the merge.
   */
  var makeFetchOptions = function(fetchOptions) {
    fetchOptions || (fetchOptions = {});
    var scopedData = _.extend({},this.dataOptions,fetchOptions.data);
    var fetchOptionsWithScope = _.clone(fetchOptions);
    if (!_.isEqual({},scopedData)) {
      fetchOptionsWithScope.data = scopedData;
    }
    return fetchOptionsWithScope;
  };

  /**
   * Extend the scope parameters.
   */
  var extend = function(newOptions) {
    _.extend(this.dataOptions,newOptions);
  };

  /**
   * Create a new scope, optionally extended with passed parameters.
   */
  var scoped = function(newOptions) {
    var newDataOptions = _.extend({},this.dataOptions,newOptions);
    return new Scope(this.model,newDataOptions);
  };

  _.extend(Scope.prototype,{
    fetch:            fetch,
    makeFetchOptions: makeFetchOptions,
    extend:           extend,
    scoped:           scoped
  });

  exported.Scope = Scope;

}).call(this);
