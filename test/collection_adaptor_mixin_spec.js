(function() {
  "use strict";

  describe("Slickback.CollectionAdaptorMixin", function() {

    var collection;
    beforeEach(function() {
      collection = {};
      _.extend(collection,Slickback.CollectionAdaptorMixin);
    });

    describe("after #installDataViewAdaptors is invoked", function() {
      beforeEach(function() { collection.installDataViewAdaptors(); });

      describe("#getLength", function() {
        it("returns the length of the models array", function() {
          collection.models = ['a','b','c','d'];
          expect(collection.getLength()).toEqual(4);
        });
      });

      describe("#getItem", function() {
        it("returns the models at the specified index", function() {
          collection.models = ['a','b','c','d'];
          expect(collection.getItem(2)).toEqual('c');
        });
      });
    });

  }); // Slickback.CollectionAdaptorMixin

}).call(this);
