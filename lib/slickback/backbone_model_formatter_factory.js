(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace = Slickback;

  var makeColumnFormatter = function(column) {
    return function(row,cell,value,col,data) {return data.get(col.field);};
  };

  /**
   * Implements a SlickGrid formatterFactory which uses the field
   * property of a column to get the corresponding value from
   * a Backbone model instance.
   */
  exportNamespace.BackboneModelFormatterFactory = {
    getFormatter: makeColumnFormatter
  };

}).call(this);
