
var Slickback = require('./lib/slickback');

require('./lib/slickback/scope');
require('./lib/slickback/scoped_model_mixin');

require('./lib/slickback/collection_events_mixin');

require('./lib/slickback/paginated_collection_mixin');
require('./lib/slickback/pager_adaptor_mixin');

require('./lib/slickback/event_translation_mixin');

require('./lib/slickback/collection_adaptor_mixin');

require('./lib/slickback/collection');
require('./lib/slickback/scoped_collection');
require('./lib/slickback/paginated_collection');

require('./lib/slickback/number_formatter');

require('./lib/slickback/text_input_editor_mixin');
require('./lib/slickback/text_cell_editor');
require('./lib/slickback/integer_cell_editor');
require('./lib/slickback/number_cell_editor');
require('./lib/slickback/dropdown_cell_editor');

require('./lib/slickback/backbone_model_formatter_factory');

exports = Slickback;

