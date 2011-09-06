(function() {
  "use strict";

  describe("Slickback.PagerAdaptorMixin", function() {

    var collection;
    beforeEach(function() {
      collection = {
        fetchWithPagination: jasmine.createSpy('fetchWithPagination')
      };
      _.extend(collection,
               Slickback.CollectionEventsMixin,
               Slickback.PagerAdaptorMixin);
      collection.installDataViewEventHandlers();
    });

    describe("#getPagingInfo", function() {
      describe("when paging parameters are present", function() {
        it("sets pageNum to page index", function() {
          collection.currentPage = 2;
          expect(collection.getPagingInfo().pageNum).toEqual(1);
        });
        it("sets pageSize", function() {
          collection.perPage = 3;
          expect(collection.getPagingInfo().pageSize).toEqual(3);
        });
        it("sets totalRows", function() {
          collection.totalEntries = 4;
          expect(collection.getPagingInfo().totalRows).toEqual(4);
        });
      });

      describe("when paging parameters are absent", function() {
        it("sets pageNum to page index", function() {
          expect(collection.getPagingInfo().pageNum).toEqual(0);
        });
      });
    });

    describe("#setPagingOptions", function() {
      describe("with defined pageSize", function() {
        it("sets perPage", function() {
          collection.setPagingOptions({ pageSize: 7 });
          expect(collection.perPage).toEqual(7);
        });
      });

      describe("with page index less than maximum page index", function() {
        it("sets currentPage to page index plus one", function() {
          collection.totalEntries = 50;
          collection.perPage = 10;
          collection.setPagingOptions({ pageNum: 3 });
          expect(collection.currentPage).toEqual(4);
        });
      });

      describe("with page index equal to maximum page index", function() {
        it("sets currentPage to page index plus one", function() {
          collection.totalEntries = 50;
          collection.perPage = 10;
          collection.setPagingOptions({ pageNum: 4 });
          expect(collection.currentPage).toEqual(5);
        });

        describe("with zero entries", function() {
          it("sets currentPage with starting index 1", function() {
            collection.totalEntries = 0;
            collection.perPage = 10;
            collection.setPagingOptions({ pageNum: 0 });
            expect(collection.currentPage).toEqual(1);
          });
        });
      });

      describe("with page index greater than maximum", function() {
        describe("when maximum page is full", function() {
          it("sets currentPage to maximum page index plus 1", function() {
            collection.totalEntries = 50;
            collection.perPage = 10;
            collection.setPagingOptions({ pageNum: 5 });
            expect(collection.currentPage).toEqual(5);
          });
        });

        describe("when maximum page is not full", function() {
          it("sets currentPage to maximum page index plus 1", function() {
            collection.totalEntries = 47;
            collection.perPage = 10;
            collection.setPagingOptions({ pageNum: 5 });
            expect(collection.currentPage).toEqual(5);
          });
        });

        describe("with zero entries", function() {
          it("sets currentPage with starting index 1", function() {
            collection.totalEntries = 0;
            collection.perPage = 10;
            collection.setPagingOptions({ pageNum: 2 });
            expect(collection.currentPage).toEqual(1);
          });
        });
      });

      it("publishes an onPagingInfoChanged notification", function() {
        collection.onPagingInfoChanged.notify =
          jasmine.createSpy("onPagingInfoChanged#notify");
        collection.setPagingOptions({ pageNum: 2 });
        expect(collection.onPagingInfoChanged.notify).
          toHaveBeenCalledWith({ pageNum: 2 });
      });

      it("invokes fetchWithPagination on the collection", function() {
        collection.setPagingOptions({ pageNum: 2 });
        expect(collection.fetchWithPagination).toHaveBeenCalled();
      });
    });

  }); // Slickback.PagerAdaptorMixin

}).call(this);
