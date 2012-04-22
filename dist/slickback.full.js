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

  /**
   * Slickback.Scope constructs scope objects that wrap a model
   * or collection to encapsulate a set of parameters to be used
   * to fetch the model or collection.
   */
  function Scope(model,dataOptions) {
    if (! this instanceof Scope) {
      return new Scope(model,dataOptions);
    }
    this.model       = model;
    this.dataOptions = dataOptions || {};
    return this;
  }

  /**
   * Fetch from model or collection, applying scope parameters.
   * Assumes model/collection has a #fetch method which accepts
   * an options object.
   */
  var fetch = function(fetchOptions) {
    var optionsWithScope = this.makeFetchOptions(fetchOptions);
    return (! _.isUndefined(this.model.fetchWithoutScope)) ?
      this.model.fetchWithoutScope(optionsWithScope) :
      this.model.fetch(optionsWithScope);
  };

  /**
   * Merge the data object (if any) of the passed options object
   * with the scope parameters. Values in the passed data object
   * take precedence over those set in the scope. A new options
   * object is returned including a data object which is the
   * result of the merge.
   */
  var makeFetchOptions = function(fetchOptions) {
    fetchOptions || (fetchOptions = {});
    var scopedData = _.extend({},this.dataOptions,fetchOptions.data);
    var fetchOptionsWithScope = _.clone(fetchOptions);
    if (!_.isEqual({},scopedData)) {
      fetchOptionsWithScope.data = scopedData;
    }
    return fetchOptionsWithScope;
  };

  /**
   * Extend the scope parameters.
   */
  var extend = function(newOptions) {
    _.extend(this.dataOptions,newOptions);
  };

  /**
   * Create a new scope, optionally extended with passed parameters.
   */
  var scoped = function(newOptions) {
    var newDataOptions = _.extend({},this.dataOptions,newOptions);
    return new Scope(this.model,newDataOptions);
  };

  _.extend(Scope.prototype,{
    fetch:            fetch,
    makeFetchOptions: makeFetchOptions,
    extend:           extend,
    scoped:           scoped
  });

  exportNamespace.Scope = Scope;

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    Scope = Slickback.Scope;

  var exportNamespace = Slickback;

  /**
   * Construct a default scope for the model or collection, or return
   * the default scope if already constructed.
   */
  var scope = function() {
    return this.defaultScope || (this.defaultScope = new Scope(this));
  };

  /**
   * Extend the default scope associated with a model or collection.
   */
  var extendScope = function(params) {
    var scope = this.scope();
    scope.extend(params);
  };

  /**
   * Clear the parameters of the default scope associated with a model
   * or collection.
   */
  var clearScope = function() {
    this.defaultScope = new Scope(this);
  };

  /**
   * Perform a fetch on a model or collection without applying default
   * scope.
   */
  var fetchWithoutScope = function(options) {
    return this.fetch(options);
  };

  /**
   * Apply the default scope to perform a fetch on a model or collection.
   */
  var fetchWithScope = function(options) {
    return this.scope().fetch(options);
  };

  /**
   * Return a scope for the model or collection, cloned from the
   * default scope.
   */
  var scoped = function(options) {
    var scope = this.scope();
    return scope.scoped(options);
  };

  /**
   * Configure a collection to use scoped fetch by default.
   */
  var installScopedModelDefaults = function() {
    if (! this.defaultScopeEnabled) {
      this.defaultScopeEnabled = true;

      this.fetchWithoutScope = this.fetch;
      this.fetch             = this.fetchWithScope;
    }
  };

  /**
   * Slickback.ScopedModelMixin can be mixed into a model or collection
   * that implements #fetch. It adds a defaultScope member which is accessed
   * via the #scope method, and applied to fetches performed via the
   * #fetchWithScope method.
   */
  exportNamespace.ScopedModelMixin = {
    scope:             scope,
    extendScope:       extendScope,
    clearScope:        clearScope,
    fetchWithoutScope: fetchWithoutScope,
    fetchWithScope:    fetchWithScope,
    scoped:            scoped,
    defaultScopeEnabled:        false,
    installScopedModelDefaults: installScopedModelDefaults
  };

}).call(this);
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
    _     = imported._,
    Slick = linkGlobal.Slick;
  // NOTE: assuming global linkage for SlickGrid

  if (typeof Slick === "undefined") {
    console.log("Failed to load SlickGrid.");
  }

  var exportNamespace = Slickback;

  var installDataViewEventHandlers = function() {
    this.onRowCountChanged   = new Slick.Event();
    this.onRowsChanged       = new Slick.Event();
    this.onPagingInfoChanged = new Slick.Event();
  };

  /**
   * Adapts a collection to be used as a Slick.Data.DataView
   * for purposes of event subscription and notification.
   * #installDataViewEventHandlers must be invoked on each instance.
   */
  exportNamespace.CollectionEventsMixin = {
    installDataViewEventHandlers: installDataViewEventHandlers
  };

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use              = Slickback.use,
    ScopedModelMixin = Slickback.ScopedModelMixin;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace  = Slickback;

  /**
   * Returns the collection's default scope with pagination parameters.
   */
  var paginatedScope = function() {
    return this.scoped({
      page:     this.currentPage,
      per_page: this.perPage
    });
  };

  /**
   * Invokes a collection's original parse method and returns results.
   */
  var parseWithoutPagination = function(response, xhr) {
    return this.parse(response,xhr);
  };

  /**
   * Returns a collection with pagination values for a fetch response.
   */
  var parseWithPagination = function(response, xhr) {
    var paginatedEntries = response.entries || response;

    paginatedEntries.currentPage  = response.currentPage;
    paginatedEntries.perPage      = response.perPage;
    paginatedEntries.totalEntries = response.totalEntries;

    return paginatedEntries;
  };

  /**
   * Invokes a collection's original add method and returns results.
   */
  var addWithoutPagination = function(models, options) {
    return this.add(models,options);
  };

  /**
   * Adds models to a collection, setting pagination parameters.
   */
  var addWithPagination = function(models, options) {
    this.currentPage  = models.currentPage || 1;
    this.perPage      = models.perPage     || models.length;
    this.totalEntries = models.totalEntries;

    return this.addWithoutPagination(models,options);
  };

  /**
   * Fetches the collection without applying the paginated scope.
   */
  var fetchWithoutPagination = function(params) {
    return this.fetch(params);
  };

  /**
   * Fetches the collection, applying the paginated scope.
   */
  var fetchWithPagination = function(params) {
    return this.paginatedScope().fetch(params);
  };

  /**
   * Configure a collection to use paginated methods (fetch/parse/add)
   * by default.
   */
  var installPaginatedIngestors = function() {
    if (! this.defaultPaginationEnabled) {
      this.defaultPaginationEnabled = true;

      this.parseWithoutPagination = this.parse;
      this.parse                  = this.parseWithPagination;

      this.addWithoutPagination   = this.add;
      this.add                    = this.addWithPagination;
    }
  };

  /**
   * Slickback.PaginatedCollectionMixin can be mixed into a collection
   * that implements #add and #fetch. It adds methods for fetching
   * the collection with pagination parameters, and parsing and adding
   * a fetched response to include pagination values.
   */
  exportNamespace.PaginatedCollectionMixin = _.extend({},ScopedModelMixin,{
    paginatedScope:            paginatedScope,
    fetchWithPagination:       fetchWithPagination,
    fetchWithoutPagination:    fetchWithoutPagination,
    parseWithPagination:       parseWithPagination,
    parseWithoutPagination:    parseWithoutPagination,
    addWithPagination:         addWithPagination,
    addWithoutPagination:      addWithoutPagination,
    defaultPaginationEnabled:  false,
    installPaginatedIngestors: installPaginatedIngestors
  });

}).call(this);
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

  var exportNamespace  = Slickback;

  /**
   * Return the pagination parameters expected by Slick.Controls.Pager.
   */
  var makeSlickPagerOptions = function() {
    return {
      pageNum:   (this.currentPage || 1) - 1, // slickgrid uses offset 0
      pageSize:  this.perPage,
      totalRows: this.totalEntries
    };
  };

  /**
   * Translate Slick.Controls.Pager parameters into the parameters used
   * by Slickback.PaginatedCollectionMixin, and publish the
   * onPagingInfoChanged notification.
   */
  var setPaginationForSlickPagerOptions = function(opts) {
    if (! _.isUndefined(opts.pageSize))  {
      this.perPage = opts.pageSize;
    }
    if (! _.isUndefined(opts.pageNum)) {
      if (_.isNumber(this.totalEntries) &&
          (_.isNumber(this.perPage) && this.perPage > 0)) {
        var maxPage =
          Math.max(1,Math.ceil(this.totalEntries / this.perPage));
        this.currentPage = Math.min((opts.pageNum + 1),maxPage);
      } else {
        this.currentPage = opts.pageNum + 1; // pageNum is zero-based
      }
    }
    // NOTE: this notification will happen again on reset
    this.onPagingInfoChanged.notify(this.getPagingInfo());
    this.fetchWithPagination();
  };

  /**
   * Adapts a paginated collection for use with Slick.Controls.Pager
   * (v1.4.3). Assumes currentPage, perPage, and totalEntries members, with
   * page numbering starting at 1. (Slickback.PaginatedCollectionMixin
   * provides this.) Also assumes onPagingInfoChanged event listener.
   * (Slickback.ModelEventsMixin provides this.)
   *
   * Slick.Controls.Pager (v1.4.3) expects the initializing dataView
   * argument to implement getPagingInfo(), setPagingOptions(opts)
   * (both provided by this mixin), as well as the onPagingInfoChanged.
   * subscribe event publisher (provided by SlickGrid.ModelEventsMixin).
   */
  exportNamespace.PagerAdaptorMixin = {
    getPagingInfo:    makeSlickPagerOptions,
    setPagingOptions: setPaginationForSlickPagerOptions
  };

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace = Slickback;

  var notifyCollectionChanged = function() {
    if (this.getPagingInfo) {
      this.onPagingInfoChanged.notify(this.getPagingInfo());
    }
    this.onRowCountChanged.notify();
    this.onRowsChanged.notify();
  };

  /**
   * Activates event translation for an instance.
   */
  var bindCollectionEventTranslations = function() {
    this.bind("reset",  notifyCollectionChanged);
    this.bind("add",    notifyCollectionChanged);
    this.bind("remove", notifyCollectionChanged);
  };

  /**
   * Adapts a collection which supports Backbone-style events
   * (e.g. Backbone.Events #bind) and Slick.Data.DataView-style events
   * (e.g. ModelEventsMixin onRowsChanged), translating Backbone
   * "reset", "add" and "remove" events into "onRowCountChanged" and
   * "onRowsChanged" notifications. If #getPagingInfo is implemented
   * (e.g. PagerAdaptorMixin), also publishes "onPagingInfoChanged".
   *
   * Note that unlike the Slick.Grid examples, the onRowCountChanged
   * notification does not include the previous count of rows and the
   * onRowsChanged notification does not include the difference in rows.
   */
  exportNamespace.EventTranslationMixin = {
    bindCollectionEventTranslations: bindCollectionEventTranslations
  };

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback');

  var exportNamespace  = Slickback;

  var getLength = function() {
    return this.models.length;
  };

  var getItem = function(i) {
    return this.models[i];
  };

  /**
   * Adapts a collection that stores its models in a model array
   * (e.g. Backbone.Collection) for use with SlickGrid v2.0
   */
  exportNamespace.CollectionAdaptorMixin = {
    getLength: getLength,
    getItem:   getItem
  };

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use                      = Slickback.use,
    CollectionEventsMixin    = Slickback.CollectionEventsMixin,
    EventTranslationMixin    = Slickback.EventTranslationMixin,
    CollectionAdaptorMixin   = Slickback.CollectionAdaptorMixin;

  var imported = use(linkGlobal, [
      { symbol: '_',        module: 'underscore' },
      { symbol: 'Backbone', module: 'backbone'   }
    ]),
    _ = imported._,
    Backbone = imported.Backbone;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending Collection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();
    this.bindCollectionEventTranslations();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               CollectionEventsMixin,
                               EventTranslationMixin,
                               CollectionAdaptorMixin);

  /**
   * A Backbone.Collection adapted to be used as a Slick.Data.DataView.
   */
  exportNamespace.Collection = Backbone.Collection.extend(mixin_members);

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use              = Slickback.use,
    Collection       = Slickback.Collection,
    ScopedModelMixin = Slickback.ScopedModelMixin;

  var imported = use(linkGlobal, [
      { symbol: '_',        module: 'underscore' },
      { symbol: 'Backbone', module: 'backbone'   }
    ]),
    _        = imported._,
    Backbone = imported.Backbone;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending Collection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();
    this.bindCollectionEventTranslations();

    this.installScopedModelDefaults();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               ScopedModelMixin);

  /**
   * A Backbone.Collection, extended with default scope,
   * adapted to be used as a Slick.Data.DataView.
   */
  exportNamespace.ScopedCollection = Collection.extend(mixin_members);

}).call(this);
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use                      = Slickback.use,
    Collection               = Slickback.Collection,
    PaginatedCollectionMixin = Slickback.PaginatedCollectionMixin,
    PagerAdaptorMixin        = Slickback.PagerAdaptorMixin;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace = Slickback;

  /**
   * NOTE: If extending PaginatedCollection with another initializer,
   * be sure to initialize these mixins.
   */
  var initializeMixins = function() {
    this.installDataViewEventHandlers();

    this.installPaginatedIngestors();

    this.bindCollectionEventTranslations();
  };

  var mixin_members = _.extend({ initialize: initializeMixins },
                               PaginatedCollectionMixin,
                               PagerAdaptorMixin);

  /**
   * A Slickback.Collection enhanced with pagination support.
   */
  exportNamespace.PaginatedCollection = Collection.extend(mixin_members);

}).call(this);
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
