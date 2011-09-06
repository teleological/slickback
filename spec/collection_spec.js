(function() {
  "use strict";

  describe("Slickback.Collection", function() {

    var collection;
    beforeEach(function() {
      collection = new Slickback.Collection();
    });

    describe("#initialize", function() {

      it("installs CollectionEventsMixin event handlers", function() {
        var handlers = [
          "onRowCountChanged",
          "onRowsChanged",
          "onPagingInfoChanged"
        ];
        _.each(handlers,function(handler) {
          expect(typeof collection[handler].subscribe).toEqual("function");
          expect(typeof collection[handler].notify).toEqual("function");
        });
      });

      it("installs CollectionAdaptorMixin adaptor methods", function() {
        var adaptors = [ "getLength", "getItem" ];
        _.each(adaptors,function(adaptor) {
          expect(typeof collection[adaptor]).toEqual("function");
        });
      });

      // EventTranslationMixin

      var eventNames = ['reset','add','remove'];
      _.each(eventNames,function(eventName) {
        describe("Backbone event " + eventName, function() {
          it("is translated to Slick.Grid notifications", function() {
            collection.onRowCountChanged.notify
              = jasmine.createSpy('onRowCountChanged#notify');
            collection.onRowsChanged.notify
              = jasmine.createSpy('onRowsChanged#notify');
            collection.onPagingInfoChanged.notify
              = jasmine.createSpy('onPagingInfoChanged#notify');

            collection.trigger(eventName);

            expect(collection.onRowCountChanged.notify).
              toHaveBeenCalled();
            expect(collection.onRowsChanged.notify).
              toHaveBeenCalled();

            // getPagingInfo is not installed
            expect(collection.onPagingInfoChanged.notify).
              wasNotCalled()
          });
        });
      });

    }); // #initialize

  }); // Slickback.Collection

}).call(this);
