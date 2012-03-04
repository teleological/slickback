(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use = Slickback.use;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace = Slickback;

  function choiceFormatter(row,cell,value,col,data) {
    var chosen = data.get(col.field); // why string?
    var choice = _.find(col.choices,function(choice) {
      // NOTE: using type coercion so element value="2" == column value: 2
      return (choice == chosen || (choice && (choice.value == chosen)));
    });
    return choice ? (choice.label || choice) :
      (typeof col.includeBlank === 'string' ? col.includeBlank : '');
  }

  exportNamespace.ChoiceFormatter = choiceFormatter;

}).call(this);
