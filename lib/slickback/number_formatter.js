(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace = Slickback;

  function thousandsSeparated(numberValue,separator) {
    var stringValue = String(numberValue);
    var numberParts = stringValue.split('.');
    var units    = numberParts[0];
    var fraction = numberParts[1];

    var result = units.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1' + separator);
    if (fraction) result += ("." + fraction);
    return result;
  }

  function getSeparator(col) {
    return (typeof col.separated === 'string') ? col.separated : ',';
  }

  /**
   * Parameters:
   * - precision (default 0 formats as integer)
   * - separated (true for comma-separated, or pass separator string)
   * - allowNull (returns null for blank values; othewise returns zero)
   */
  function numberFormatter(row,cell,value,col,data) {
    var rawValue = data.get(col.field);

    if (!rawValue || rawValue === "") {
      if (col.allowNull) return null;
      rawValue = 0;
    }

    var numberValue;
    if (col.precision) {
      numberValue = (typeof rawValue === 'number') ?
        rawValue : parseFloat(rawValue);
      numberValue = numberValue.toFixed(col.precision);
    }
    else {
      numberValue = (typeof rawValue === 'number') ?
        rawValue.toFixed(0) : parseFloat(rawValue).toFixed(0);
    }

    if (col.separated) {
      var separator = getSeparator(col);
      return thousandsSeparated(numberValue,separator);
    }
    else {
      return String(numberValue);
    }
  }

  /**
   * Strip formatting that would prevent a value from being serialized.
   */
  numberFormatter.unformat = function(value,col) {
    if ((typeof value === 'string') && col.separated) {
      var separator = getSeparator(col);
      var escapedSeparator = separator.replace(/[.]/g,"\\$&");
      var separatorMatcher = new RegExp(escapedSeparator,'g');
      return value.replace(separatorMatcher,'');
    }
    else {
      return value;
    }
  };

  exportNamespace.NumberFormatter = numberFormatter;

}).call(this);
