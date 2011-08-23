(function() {
  "use strict";

  var productColumns = [
    {
      id:    'product_id',
      name:  'Product #',
      field: 'id',
      width: 100
    },
    {
      id:    'product_name',
      name:  'Name',
      field: 'name',
      width: 150
    },
    {
      id:      'product_price',
      name:    'Price',
      field:   'price',
      sortable: true,
      cssClass: 'alignRight'
    }
  ];

  function initializeProductsGridView(initializationOpts) {
    this.pager  = initializationOpts.pager;

    var gridOptions = _.extend({},{
      formatterFactory: Slickback.BackboneModelFormatterFactory
    },initializationOpts.grid);

    var collection = this.collection;

    var grid =
      new Slick.Grid(this.el,collection,productColumns,gridOptions);
    var pager =
      new Slick.Controls.Pager(collection,grid,this.pager);

    grid.onSort = function(column, isAscending) {
      collection.extendScope({
        order:     column.field,
        direction: (isAscending ? 'ASC' : 'DESC')
      });
      collection.fetchWithScope(); // NOTE: resetting pagination
    };

    collection.onRowCountChanged.subscribe(function() {
      grid.updateRowCount();
      grid.render();
    });

    collection.onRowsChanged.subscribe(function() {
      grid.removeAllRows();
      grid.render();
    });

    collection.fetchWithPagination();
  }

  var productsGridView = Backbone.View.extend({
    initialize: initializeProductsGridView
  });


  this.Example || (this.Example = {});
  this.Example.Views = { ProductsGrid: productsGridView   };

}).call(this);
