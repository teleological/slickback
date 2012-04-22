(function() {
  "use strict";

  /*global _:true*/

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use = Slickback.use;

  var imported = use(linkGlobal, [
      { symbol: '$', module: 'jquery' }
    ]),
    $ = imported.$;

  var exportNamespace = Slickback;

  var destroyInput = function() {
    this.$input.remove();
  };

  var focusInput = function() {
    this.$input.focus();
  };

  var unformattedModelValue = function(model) {
    return model.get(this.column.field);
  };

  var formattedModelValue = function(model) {
    var column = this.column;
    return column.formatter ? // NOTE: not passing row,column,value
      column.formatter(null,null,null,column,model) :
      model.get(column.field);
  };

  var unformatValue = function(value,column) {
    return (column.formatter && column.formatter.unformat) ?
      column.formatter.unformat(value,column) : value;
  };

  var unformattedInputValue = function() {
    var inputValue = this.$input.val();
    return unformatValue(inputValue,this.column);
  };

  var loadValueFromModel = function(model) {
    var editValue = this.formattedModelValue(model);
    this.defaultValue = editValue;
    this.$input.val(editValue);
    this.$input[0].defaultValue = editValue;
    this.$input.select(); // ok for selects?
  };

  var setModelValue = function(model,value) {
    var column = this.column;
    var internalValue = unformatValue(value,column);
    var newValues = {};
    newValues[column.field] = internalValue;
    model.set(newValues);
  };

  var isInputValueChanged = function() {
    /*jshint eqeqeq:false eqnull:true*/
    return (!(this.$input.val() == null && this.defaultValue == null) &&
             (this.$input.val() != this.defaultValue));
  };

  var createInputElement = function() {
    var $input = $('<input type="text" class="editor-text" />');
    $input.bind("keydown.nav", function(e) {
      if (e.keyCode === $.ui.keyCode.LEFT ||
          e.keyCode === $.ui.keyCode.RIGHT) {
        e.stopImmediatePropagation();
      }
    });
    $input.appendTo(this.container);
    $input.focus().select();
    return $input;
  };

  var makeElement = function(tag, attributes, content) {
    var $element = $(tag);
    if (attributes) $element.attr(attributes);
    if (content) $element.html(content);
    return $element;
  };

  var createSelectElement = function() {
    var $input = makeElement('<select>',this.column.attributes);
    if (this.column.includeBlank) {
      var option = _.isString(this.column.includeBlank) ?
        makeElement('<option>',{ value: null }, this.column.includeBlank) :
        makeElement('<option>',{ value: null }); 
      $input.append(option);
    }
    _.each(this.column.choices, function(choice) {
      var value  = choice.value || choice;
      var label  = choice.label || value;
      var option = makeElement('<option>',{ value: value },label);
      $input.append(option);
    }); 
    $input.appendTo(this.container);
    $input.focus();
    return $input;
  };

  var EditorMixin = {
    createTextInputElement: createInputElement,
    createSelectElement:    createSelectElement,
    destroy:                destroyInput,
    focus:                  focusInput,
    loadValue:              loadValueFromModel,
    applyValue:             setModelValue,
    isValueChanged:         isInputValueChanged,
    unformattedModelValue:  unformattedModelValue,
    formattedModelValue:    formattedModelValue,
    unformattedInputValue:  unformattedInputValue
  };

  exportNamespace.EditorMixin = EditorMixin;

}).call(this);
