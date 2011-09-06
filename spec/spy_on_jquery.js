/**
 * Replaces the global $ and jQuery functions, as installed by the
 * jQuery library with a jasmine spy that delegates to the actual
 * implementation.
 */
(function() {
  var $implementation = window.$;
  var linkGlobal = (typeof global  === 'undefined') ? this : global;

  var $spy = linkGlobal.jQuery = linkGlobal.$ =
    jasmine.createSpy('$').andCallFake($implementation);

  afterEach(function() { $spy.reset(); });
}).call(this);
