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

  function DropdownCellEditor(args) {
    this.container    = args.container;
    this.column       = args.column;
    this.defaultValue = null;
    this.$input       = this.createSelectElement();
  }

  var loadValueFromModelWithoutFormatting = function(model) {
    var editValue = this.unformattedModelValue(model);
    this.defaultValue = editValue;
    this.$input.val(editValue);
    this.$input[0].defaultValue = editValue;
    this.$input.select(); // ok for selects?
  };

  var serializeValue = function() {
    return this.$input.val(); // i.e. use value
  };

  var validateAll = function() {
    return { valid: true,  msg: null };
  };

  _.extend(DropdownCellEditor.prototype, EditorMixin, {
    loadValue:      loadValueFromModelWithoutFormatting,
    serializeValue: serializeValue,
    validate:       validateAll
  });

  exportNamespace.DropdownCellEditor = DropdownCellEditor;

}).call(this);
