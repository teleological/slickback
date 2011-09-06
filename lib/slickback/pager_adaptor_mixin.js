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
    _ = imported._;

  var exportNamespace  = Slickback;

  /**
   * Return the pagination parameters expected by Slick.Controls.Pager.
   */
  var makeSlickPagerOptions = function() {
    return {
      pageNum:   (this.currentPage || 1) - 1, // slickgrid uses offset 0
      pageSize:  this.perPage,
      totalRows: this.totalEntries
    };
  };

  /**
   * Translate Slick.Controls.Pager parameters into the parameters used
   * by Slickback.PaginatedCollectionMixin, and publish the
   * onPagingInfoChanged notification.
   */
  var setPaginationForSlickPagerOptions = function(opts) {
    if (! _.isUndefined(opts.pageSize))  {
      this.perPage = opts.pageSize;
    }
    if (! _.isUndefined(opts.pageNum)) {
      if (_.isNumber(this.totalEntries) &&
          (_.isNumber(this.perPage) && this.perPage > 0)) {
        var maxPage =
          Math.max(1,Math.ceil(this.totalEntries / this.perPage));
        this.currentPage = Math.min((opts.pageNum + 1),maxPage);
      } else {
        this.currentPage = opts.pageNum + 1; // pageNum is zero-based
      }
    }
    // NOTE: this notification will happen again on reset
    this.onPagingInfoChanged.notify(this.getPagingInfo());
    this.fetchWithPagination();
  };

  /**
   * Adapts a paginated collection for use with Slick.Controls.Pager
   * (v1.4.3). Assumes currentPage, perPage, and totalEntries members, with
   * page numbering starting at 1. (Slickback.PaginatedCollectionMixin
   * provides this.) Also assumes onPagingInfoChanged event listener.
   * (Slickback.ModelEventsMixin provides this.)
   *
   * Slick.Controls.Pager (v1.4.3) expects the initializing dataView
   * argument to implement getPagingInfo(), setPagingOptions(opts)
   * (both provided by this mixin), as well as the onPagingInfoChanged.
   * subscribe event publisher (provided by SlickGrid.ModelEventsMixin).
   */
  exportNamespace.PagerAdaptorMixin = {
    getPagingInfo:    makeSlickPagerOptions,
    setPagingOptions: setPaginationForSlickPagerOptions
  };

}).call(this);
