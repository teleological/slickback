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

  function TextCellEditor(args) {
    this.container    = args.container;
    this.column       = args.column;
    this.defaultValue = null;
    this.$input       = this.createTextInputElement();
  }

  var serializeValue = function() {
    return this.$input.val();
  };

  var validateText = function() {
    var column = this.column;
    return column.validator ?
      column.validator(this.$input.val()) : { valid: true, msg: null };
  };

  _.extend(TextCellEditor.prototype, EditorMixin, {
    serializeValue: serializeValue,
    validate:       validateText
  });

  exportNamespace.TextCellEditor = TextCellEditor;

}).call(this);
