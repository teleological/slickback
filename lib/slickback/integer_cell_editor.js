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

  function IntegerCellEditor(args) {
    this.container    = args.container;
    this.column       = args.column;
    this.defaultValue = null;
    this.$input       = this.createTextInputElement();
  }

  var serializeInteger = function() {
    var value = this.unformattedInputValue();
    return parseInt(value,10) || 0;
  };

  var validateInteger = function() {
    return isNaN(this.unformattedInputValue()) ?
      { valid: false, msg: "Please enter a valid integer" } :
      { valid: true,  msg: null                           };
  };

  _.extend(IntegerCellEditor.prototype, EditorMixin, {
    serializeValue: serializeInteger,
    validate:       validateInteger
  });

  exportNamespace.IntegerCellEditor = IntegerCellEditor;

}).call(this);
