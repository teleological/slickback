(function() {
  "use strict";

  var productModel = Backbone.Model.extend({});

  function simulatedPaginatedSource(method,model,options) {
    var models = [];
    _.times(57,function(i) {
      var model = { 
        id:    (100 + i),
        name:  ("Product " + (1 + i)),
        price: ((Math.floor(Math.random()*101)) + 0.99)
      };
      models.push(model);
    });

    var dataParams = options.data || {};

    var page       = dataParams['page']     || 1;
    var pageSize   = dataParams['per_page'] || 5;

    var offset = ((page - 1) * pageSize);

    var rows = models;
    var orderBy;
    if (orderBy = dataParams.order) {
      rows = _.sortBy(rows, function(p) { return p[orderBy] });
      if (dataParams.direction === 'DESC') { rows = rows.reverse(); }
    }
    rows = rows.slice(offset,(offset + pageSize));

    var data = {
      entries:      rows,
      currentPage:  page,
      perPage:      pageSize,
      totalEntries: models.length
    };
    options.success(data);
  }

  /**
   * To use a real data source, don't implement sync and
   * provide the collection with a url which understands 
   * the pagination and sorting parameters, and which returns
   * paginated results.
   */
  var productsCollection = Slickback.PaginatedCollection.extend({
    model: productModel,
    sync:  simulatedPaginatedSource
  });

  this.Example || (this.Example = {});
  this.Example.Models = { Product: productModel };
  this.Example.Collections = { Products: productsCollection };

}).call(this);
