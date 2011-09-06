(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use         = Slickback.use,
    EditorMixin = Slickback.EditorMixin;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace = Slickback;

  function NumberCellEditor(args) {
    this.container    = args.container;
    this.column       = args.column;
    this.defaultValue = null;
    this.$input       = this.createTextInputElement();
  }

  var serializeNumber = function() {
    var value     = this.unformattedInputValue();
    var precision = this.column.precision;
    return (precision ?
            parseFloat(value).toFixed(precision) :
            parseFloat(value).toFixed(0));
  };

  var validateNumber = function() {
    return isNaN(this.unformattedInputValue()) ?
      { valid: false, msg: "Please enter a valid number" } :
      { valid: true,  msg: null                           };
  };

  _.extend(NumberCellEditor.prototype, EditorMixin, {
    serializeValue: serializeNumber,
    validate:       validateNumber
  });

  exportNamespace.NumberCellEditor = NumberCellEditor;

}).call(this);
