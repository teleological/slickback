(function() {
 "use strict";

  var jsdom         = require('jsdom'),
      jsdomDocument = jsdom.jsdom('<html><body></body></html>');
  global.window   = jsdomDocument.createWindow();

  require('../vendor/jquery-1.6.2');
  require('./spy_on_jquery.js');

  global._        = require('../vendor/underscore-1.1.7/underscore');
  global.Backbone = require('../vendor/backbone-0.5.3/backbone');

  global.Slickback = require('../lib/slickback');

  require('../lib/slickback/scope');
  require('../lib/slickback/scoped_model_mixin');

  require('../lib/slickback/collection_events_mixin');

  require('../lib/slickback/paginated_collection_mixin');
  require('../lib/slickback/pager_adaptor_mixin');

  require('../lib/slickback/event_translation_mixin');

  require('../lib/slickback/collection_adaptor_mixin');

  require('../lib/slickback/collection');
  require('../lib/slickback/scoped_collection');
  require('../lib/slickback/paginated_collection');

  require('../lib/slickback/number_formatter');
  require('../lib/slickback/choice_formatter');

  require('../lib/slickback/editor_mixin');
  require('../lib/slickback/text_cell_editor');
  require('../lib/slickback/integer_cell_editor');
  require('../lib/slickback/number_cell_editor');
  require('../lib/slickback/dropdown_cell_editor');

  require('../lib/slickback/backbone_model_formatter_factory');

}).call(this);
