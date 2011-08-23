(function() {
  "use strict";

  describe("Slickback.EventTranslationMixin", function() {

    var collection;
    beforeEach(function() {
      collection = { getPagingInfo: function() { return { foo: "bar" } } };
      _.extend(collection,
               Backbone.Events,
               Slickback.CollectionEventsMixin,
               Slickback.EventTranslationMixin);
    });

    describe("#bindCollectionEventTranslations", function() {

      var slickEvents = [
        "onPagingInfoChanged",
        "onRowCountChanged",
        "onRowsChanged"
      ];
      beforeEach(function() {
        collection.installDataViewEventHandlers();
        collection.bindCollectionEventTranslations();
        _.each(slickEvents, function(slickEvent) {
          collection[slickEvent].notify = jasmine.createSpy(slickEvent);
        });
      });

      var backboneEvents = ["reset","add","remove"];
      _.each(backboneEvents, function(eventName) {
        describe("Backbone trigger " + eventName, function() {
          it("publishes onPagingInfoChanged with paging info", function() {
            collection.trigger(eventName);
            expect(collection.onPagingInfoChanged.notify).
              toHaveBeenCalledWith({ foo: "bar" });
          });

          it("publishes onRowCountChanged", function() {
            collection.trigger(eventName);
            expect(collection.onRowCountChanged.notify).
              toHaveBeenCalled();
          });

          it("publishes onRowsChanged", function() {
            collection.trigger(eventName);
            expect(collection.onRowsChanged.notify).
              toHaveBeenCalled();
          });
        });
      });

    });

  }); // Slickback.EventTranslationMixin

}).call(this);
