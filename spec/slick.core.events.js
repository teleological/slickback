/**
 * To support tests, excerpting just enough of slick.core.js
 * to satisfy Slickback's dependencies.
 */
(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var Slick = linkGlobal.Slick = this;

  var EventData = Slick.EventData = function() {
    var isPropagationStopped = false;
    var isImmediatePropagationStopped = false;

    this.stopPropagation = function () {
      isPropagationStopped = true;
    };

    this.isPropagationStopped = function () {
      return isPropagationStopped;
    };

    this.stopImmediatePropagation = function () {
      isImmediatePropagationStopped = true;
    };

    this.isImmediatePropagationStopped = function () {
      return isImmediatePropagationStopped;
    }
  };

  Slick.Event = function() {
    var handlers = [];

    this.subscribe = function (fn) {
      handlers.push(fn);
    };

    this.unsubscribe = function (fn) {
      for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === fn) {
          handlers.splice(i, 1);
        }
      }
    };

    this.notify = function (args, e, scope) {
      e = e || new EventData();
      scope = scope || this;

      var returnValue;
      for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
        returnValue = handlers[i].call(scope, e, args);
      }

      return returnValue;
    };
  };

}).call(this);
