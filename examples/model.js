(function() {
  "use strict";

  function simulateSync(method,model,options) {
    switch(method) {
      case 'read':
        return simulatePaginatedRead(model,options);
        break;
      case 'update':
        return simulatePaginatedUpdate(model,options);
        break;
      default:
        throw "Method " + method + "not implemented";
        break;
    }
  }

  function simulatePaginatedRead(model,options) {
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

  function simulatePaginatedUpdate(model,options) {
    var offset = (model.id || 0) - 100;
    if (offset >= 0) { models[offset] = model.attributes; }
    options.success();
  }

  var productModel = Backbone.Model.extend({
    sync: simulateSync
  });

  var models = [];
  _.times(57,function(i) {
    var model = { 
      id:    (100 + i),
      name:  ("Product " + (1 + i)),
      condition: (Math.floor(Math.random() * 4) + 1),
      price: ((Math.floor(Math.random()*1001) * 10) + 0.50)
    };
    models.push(model);
  });

  /**
   * To use a real data source, don't implement sync and
   * provide the collection with a url which understands 
   * the pagination and sorting parameters, and which returns
   * paginated results.
   */
  var productsCollection = Slickback.PaginatedCollection.extend({
    model: productModel,
    sync:  simulateSync
  });

  this.Example || (this.Example = {});
  this.Example.Models = { Product: productModel };
  this.Example.Collections = { Products: productsCollection };

}).call(this);
