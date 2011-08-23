(function() {
  "use strict";

  var bundle = (typeof exports == "undefined") ? this : exports;

  var imported = (typeof require  == 'undefined') ? this : {
    _:         require('underscore'),
    Slickback: (bundle.Slickback || require('../slickback').Slickback)
  };

  var _         = imported._;
  var Slickback = imported.Slickback;

  var exported  = Slickback;

  var ScopedModelMixin = Slickback.ScopedModelMixin;

  /**
   * Returns the collection's default scope with pagination parameters.
   */
  var paginatedScope = function() {
    return this.scoped({
      page:     this.currentPage,
      per_page: this.perPage
    });
  };

  /**
   * Invokes a collection's original parse method and returns results.
   */
  var parseWithoutPagination = function(response, xhr) {
    return this.parse(response,xhr);
  };

  /**
   * Returns a collection with pagination values for a fetch response.
   */
  var parseWithPagination = function(response, xhr) {
    var paginatedEntries = response.entries || response;

    paginatedEntries.currentPage  = response.currentPage;
    paginatedEntries.perPage      = response.perPage;
    paginatedEntries.totalEntries = response.totalEntries;

    return paginatedEntries;
  };

  /**
   * Invokes a collection's original add method and returns results.
   */
  var addWithoutPagination = function(models, options) {
    return this.add(models,options);
  };

  /**
   * Adds models to a collection, setting pagination parameters.
   */
  var addWithPagination = function(models, options) {
    this.currentPage  = models.currentPage || 1;
    this.perPage      = models.perPage     || models.length;
    this.totalEntries = models.totalEntries;

    return this.addWithoutPagination(models,options);
  };

  /**
   * Fetches the collection without applying the paginated scope.
   */
  var fetchWithoutPagination = function(params) {
    return this.fetch(params);
  };

  /**
   * Fetches the collection, applying the paginated scope.
   */
  var fetchWithPagination = function(params) {
    return this.paginatedScope().fetch(params);
  };

  /**
   * Configure a collection to use paginated methods (fetch/parse/add)
   * by default.
   */
  var installPaginatedIngestors = function() {
    if (! this.defaultPaginationEnabled) {
      this.defaultPaginationEnabled = true;

      this.parseWithoutPagination = this.parse;
      this.parse                  = this.parseWithPagination;

      this.addWithoutPagination   = this.add;
      this.add                    = this.addWithPagination;
    }
  };

  /**
   * Slickback.PaginatedCollectionMixin can be mixed into a collection
   * that implements #add and #fetch. It adds methods for fetching
   * the collection with pagination parameters, and parsing and adding
   * a fetched response to include pagination values.
   */
  exported.PaginatedCollectionMixin = _.extend({}, ScopedModelMixin, {
    paginatedScope:            paginatedScope,
    fetchWithPagination:       fetchWithPagination,
    fetchWithoutPagination:    fetchWithoutPagination,
    parseWithPagination:       parseWithPagination,
    parseWithoutPagination:    parseWithoutPagination,
    addWithPagination:         addWithPagination,
    addWithoutPagination:      addWithoutPagination,
    defaultPaginationEnabled:  false,
    installPaginatedIngestors: installPaginatedIngestors
  });

}).call(this);
