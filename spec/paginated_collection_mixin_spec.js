(function() {
  "use strict";

  describe("Slickback.PaginatedCollectionMixin", function() {

    var collection;
    beforeEach(function() {
      collection = {};
      _.extend(collection,Slickback.PaginatedCollectionMixin);
    });

    describe("#paginatedScope", function() {
      describe("when no pagination parameters are set", function() {
        it("returns a scope with no pagination options", function() {
          var scope = collection.paginatedScope();
          expect(scope.dataOptions).toEqual({});
        });
      });

      describe("when pagination parameters are set", function() {
        it("returns a scope with pagination options", function() {
          collection.currentPage = 2;
          collection.perPage     = 15;
          var scope = collection.paginatedScope();
          expect(scope.dataOptions).toEqual({ page: 2, per_page: 15 });
        });
      });
    }); // #paginatedScope

    describe("#parseWithoutPagination", function() {
      it("invokes the original parse method, returning result", function() {
        var response = [ "a", "b", "c" ];
        collection.parse = jasmine.createSpy("parse").andReturn("out");
        var parsed = collection.parseWithoutPagination(response);

        expect(collection.parse).
          toHaveBeenCalledWith(response,jasmine.undefined);
        expect(parsed).toEqual("out");
      });

      describe("after installing paginated ingestors", function() {
        it("behaves the same as before", function() {
          var originalParse = collection.parse =
            jasmine.createSpy("parse").andReturn("out");
          collection.installPaginatedIngestors();

          var response = [ "a", "b", "c" ];
          var parsed = collection.parseWithoutPagination(response);

          expect(originalParse).toHaveBeenCalledWith(response);
          expect(parsed).toEqual("out");
        });
      });
    }); // #parseWithoutPagination

    describe("#parseWithPagination", function() {
      describe("when paginated values are in response.entries", function() {
        it("returns the entries with pagination parameters", function() {
          var entries = [ "foo", "bar", "baz" ];
          var response = {
            entries:      entries,
            currentPage:  2,
            perPage:      5,
            totalEntries: 8
          };

          var parsed = collection.parseWithPagination(response)
          expect(parsed).toEqual(entries);
          expect(parsed.currentPage).toEqual(2);
          expect(parsed.perPage).toEqual(5);
          expect(parsed.totalEntries).toEqual(8);
        });
      });

      describe("when response.entries is not set", function() {
        it("returns the response object", function() {
          var response = [ "foo", "bar", "baz" ];

          var parsed = collection.parseWithPagination(response)
          expect(parsed).toEqual(response);
          expect(parsed.currentPage).toBeUndefined();
          expect(parsed.perPage).toBeUndefined();
          expect(parsed.totalEntries).toBeUndefined();
        });
      });
    }); // #parseWithPagination

    describe("#addWithoutPagination", function() {
      it("invokes add on the collection", function() {
        collection.add = jasmine.createSpy("add")

        var models  = [ "foo", "bar", "baz" ];
        var options = { qux: "quxx" };
        collection.addWithoutPagination(models,options);
        expect(collection.add).toHaveBeenCalledWith(models,options);
      });

      it("returns the result of calling add on the collection", function() {
        collection.add = function() { return "burma shave"; };

        var models  = [ "foo", "bar", "baz" ];
        var options = { qux: "quxx" };
        var result = collection.addWithoutPagination(models,options);
        expect(result).toEqual("burma shave");
      });

      describe("after installing paginated ingestors", function() {
        it("behaves the same as before", function() {
          var originalAdd = collection.add =
            jasmine.createSpy("add").andReturn("burma shave");
          collection.installPaginatedIngestors();

          var models  = [ "foo", "bar", "baz" ];
          var options = { qux: "quxx" };
          var result = collection.addWithoutPagination(models,options);
          expect(originalAdd).toHaveBeenCalledWith(models,options);
          expect(result).toEqual("burma shave");
        });
      });
    }); // #addWithoutPagination

    describe("#addWithPagination", function() {
      it("sets pagination parameters from the models object", function() {
        collection.add = function() {};

        var models  = [ "foo", "bar", "baz" ];
        var options = { qux: "quxx" };
        models.currentPage  = 2;
        models.perPage      = 5;
        models.totalEntries = 8;
        collection.addWithPagination(models,options);

        expect(collection.currentPage).toEqual(2);
        expect(collection.perPage).toEqual(5);
        expect(collection.totalEntries).toEqual(8);
      });

      it("sets defaults when pagination parameters aren't set", function() {
        collection.add = function() {};

        var models  = [ "foo", "bar", "baz" ];
        var options = { qux: "quxx" };
        collection.addWithPagination(models,options);

        expect(collection.currentPage).toEqual(1);
        expect(collection.perPage).toEqual(models.length);
        expect(collection.totalEntries).toBeUndefined();
      });

      it("invokes addWithoutPagination and returns the result", function() {
        collection.add = jasmine.createSpy("add").andReturn("shazbot");

        var models  = [ "foo", "bar", "baz" ];
        var options = { qux: "quxx" };
        var result = collection.addWithPagination(models,options);

        expect(collection.add).toHaveBeenCalledWith(models,options);
        expect(result).toEqual("shazbot");
      });
    }); // #addWithPagination

    describe("#fetchWithPagination", function() {
      it("invokes fetch with paginated scope", function() {
        var scope = {
          fetch: jasmine.createSpy("fetch").andReturn("fetched")
        };
        collection.paginatedScope = function() { return scope };

        var result = collection.fetchWithPagination({ foo: "bar" });
        expect(scope.fetch).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toEqual("fetched");
      });
    }); // #fetchWithPagination

    describe("#fetchWithoutPagination", function() {
      it("invokes fetch and returns result", function() {
        collection.fetch = jasmine.createSpy("fetch").andReturn("fetched");
        collection.paginatedScope = jasmine.createSpy("paginatedScope");

        var result = collection.fetchWithoutPagination({ foo: "bar" });
        expect(collection.fetch).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toEqual("fetched");
        expect(collection.paginatedScope).wasNotCalled();
      });
    }); // #fetchWithoutPagination

    describe("#installPaginatedIngestors", function() {
      var originalParse, originalAdd;
      beforeEach(function() {
        originalParse = collection.parse = jasmine.createSpy("parse");
        originalAdd   = collection.add   = jasmine.createSpy("add");
        collection.installPaginatedIngestors();
      });

      it("replaces parse with parseWithPagination", function() {
        expect(collection.parse).toBe(collection.parseWithPagination);
        expect(collection.parseWithoutPagination).toBe(originalParse);
      });

      it("replaces add with addWithPagination", function() {
        expect(collection.add).toBe(collection.addWithPagination);
        expect(collection.addWithoutPagination).toBe(originalAdd);
      });

      it("does not corrupt functions when reinvoked", function() {
        collection.installPaginatedIngestors();
        expect(collection.parse).toBe(collection.parseWithPagination);
        expect(collection.parseWithoutPagination).toBe(originalParse);
        expect(collection.add).toBe(collection.addWithPagination);
        expect(collection.addWithoutPagination).toBe(originalAdd);
      });
    }); // #installPaginatedIngestors

  }); // Slickback.PaginatedCollectionMixin

}).call(this);
