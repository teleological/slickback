(function() {
  "use strict";

  /**
   * If require is available and a module is specified,
   * use require to load the module. If a member is specified
   * return that member from the loaded module.
   */
  function useModule(spec) {
    if (typeof require === 'function' && spec.module) {
      var module = spec.module,
        member = (spec.member || spec.symbol);
      var loaded;
      try { loaded = require(module); } catch(e) {}
      if (loaded !== void 0) {
        return member ? loaded[member] : loaded;
      }
    }
  }

  /**
   * Import values from the provided object (importNamespace),
   * falling back on useModule as necessary. Returns an
   * object with the imported symbols.
   */
  function use(importNamespace, specs) {
    var imported = {};
    for (var i = 0, l = specs.length; i < l; i++) {
      var spec = specs[i],
          symbol = spec.symbol,
          value = importNamespace && importNamespace[symbol];
      if (value === void 0) { value = useModule(spec);  }
      if (value !== void 0) { imported[symbol] = value; }
    }
    return imported;
  }

  /**
   * When an explicit global object is provided, it is used
   * to lookup required symbols. Otherwise, "this" is used.
   */
  var linkGlobal = (typeof global  === 'undefined') ? this : global;

  /**
   * When an explicit exports object is provided, it is used
   * as the namespace in which to define exported symbols.
   * Otherwise, "this" is used.
   *
   * Note that when modules are combined into a single file and loaded
   * together, the exports object is shared across all of the modules
   * in the file.
   */
  var linkModule = (typeof exports === 'undefined') ?
    (this.Slickback = {}) : exports;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportedNamespace = linkModule;

  _.extend(exportedNamespace,{
    Slickback: exportedNamespace,
    VERSION:   '0.3.0',
    use:       use
  });

}).call(this);
