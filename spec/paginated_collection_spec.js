(function() {
  "use strict";

  describe("Slickback.PaginatedCollection", function() {

    var collection;
    beforeEach(function() {
      collection = new Slickback.PaginatedCollection();
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

      // PaginatedCollectionMixin

      it("installs #parseWithPagination as #parse", function() {
        expect(collection.parse).toBe(collection.parseWithPagination);
      });

      it("installs #addWithPagination as #add", function() {
        expect(collection.add).toBe(collection.addWithPagination);
      });

      // EventTranslationMixin

      var eventNames = ['reset','add','remove'];
      _.each(eventNames,function(eventName) {
        describe("Backbone event " + eventName, function() {
          it("is translated to Slick.Grid notifications", function() {
            collection.onPagingInfoChanged.notify
              = jasmine.createSpy('onPagingInfoChanged#notify');
            collection.onRowCountChanged.notify
              = jasmine.createSpy('onRowCountChanged#notify');
            collection.onRowsChanged.notify
              = jasmine.createSpy('onRowsChanged#notify');

            collection.trigger(eventName);

            expect(collection.onPagingInfoChanged.notify).
              toHaveBeenCalled();
            expect(collection.onRowCountChanged.notify).
              toHaveBeenCalled();
            expect(collection.onRowsChanged.notify).
              toHaveBeenCalled();
          });
        });
      });

    }); // #initialize

  }); // Slickback.PaginatedCollection

}).call(this);
