(function() {
  "use strict";

  describe("Slickback.CollectionEventsMixin", function() {

    var collection;
    beforeEach(function() {
      collection = {};
      _.extend(collection,Slickback.CollectionEventsMixin);
    });

    describe("after #installDataViewEventHandlers is invoked", function() {
      beforeEach(function() { collection.installDataViewEventHandlers(); });

      var eventNames = [
        "onRowCountChanged",
        "onRowsChanged",
        "onPagingInfoChanged"
      ];

      _.each(eventNames, function(eventName) {
        describe(eventName, function() {

          describe("#subscribe", function() {
            it("registers an event handler", function() {
              var subscriber = jasmine.createSpy(eventName);
              collection[eventName].subscribe(subscriber);

              var msg = { foo: "bar" };
              collection[eventName].notify(msg)
              expect(subscriber).toHaveBeenCalledWith(msg);
            });
          });

          describe("#notify", function() {
            describe("when no subscriptions are registered", function() {
              it("ignores the notification", function() {
                collection[eventName].notify({ foo: "bar" });
              });
            });
          });

        });
      });
    });

  }); // Slickback.CollectionEventsMixin

}).call(this);
