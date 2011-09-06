(function() {
  "use strict";

  var productColumns = [
    {
      id:       'product_id',
      name:     'Product #',
      field:    'id',
      sortable: true,
      width:    120
    },
    {
      id:       'product_name',
      name:     'Name',
      field:    'name',
      width:    150,
      editable: true,
      editor:   Slickback.TextCellEditor
    },
    {
      id:        'product_condition',
      name:      'Condition',
      field:     'condition',
      editable:  true,
      choices: [
        { label: 'Excellent', value: 4 },
        { label: 'Good',      value: 3 },
        { label: 'Fine',      value: 2 },
        { label: 'Poor',      value: 1 },
      ],
      formatter: Slickback.ChoiceFormatter,
      editor:    Slickback.DropdownCellEditor,
      width:     150
    },
    {
      id:       'product_price',
      name:     'Price',
      field:    'price',
      sortable:  true,
      width:     120,
      cssClass:  'alignRight',
      formatter: Slickback.NumberFormatter,
      precision: 2,
      separated: true,
      editable:  true,
      editor:    Slickback.NumberCellEditor,
    }
  ];

  function initializeProductsGridView(initializationOpts) {
    this.pager  = initializationOpts.pager;

    var gridOptions = _.extend({},{
      editable:         true,
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

    collection.bind('change',function(model,attributes) {
      model.save();
    });

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
