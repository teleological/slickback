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

  var makeColumnFormatter = function(column) {
    return function(row,cell,value,col,data) {return data.get(col.field);};
  };

  exported.BackboneModelFormatterFactory = {
    getFormatter: makeColumnFormatter
  };

}).call(this);
