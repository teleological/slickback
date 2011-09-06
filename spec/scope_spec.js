(function() {
  "use strict";

  describe("Slickback.Scope", function() {

    describe("#fetch", function() {
      var model, scope;
      beforeEach(function() {
        model = { fetch: jasmine.createSpy('fetch') };
        scope = new Slickback.Scope(model);
      });

      it("makes fetch options then fetches with them", function() {
        spyOn(scope, 'makeFetchOptions').andReturn({ baz: "qux" });

        var options = { foo: "bar" };
        scope.fetch(options);

        expect(scope.makeFetchOptions).toHaveBeenCalledWith(options);
        expect(model.fetch).toHaveBeenCalledWith({ baz: "qux" });
      });

      describe("when model defines fetchWithoutScope", function() {
        it("uses fetchWithoutScope instead of fetch", function() {
          model.fetchWithoutScope = jasmine.createSpy('fetchWithoutScope');

          var options = { foo: "bar" };
          scope.fetch(options);

          expect(model.fetchWithoutScope).
            toHaveBeenCalledWith({ foo: "bar" });
        });
      });
    }); // #fetch

    describe("#makeFetchOptions", function() {
      describe("when scope is blank", function() {
        var model, scope;
        beforeEach(function() {
          model = {};
          scope = new Slickback.Scope(model);
        });

        describe("with no arguments", function() {
          it("returns a blank object", function() {
            var options = scope.makeFetchOptions();
            expect(options).toEqual({});
          });
        });

        describe("with an object without a data object", function() {
          it("returns a copy of the object", function() {
            var input = { foo: "bar" };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual(input);
            expect(options).toNotBe(input);
          });
        });

        describe("with an object with a blank data object", function() {
          it("returns a copy of the object", function() {
            var input = { foo: "bar", data: {} };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual(input);
            expect(options).toNotBe(input);
          });
        });

        describe("with an object with a non-blank data object", function() {
          it("returns a copy of the object", function() {
            var input = { foo: "bar", data: { baz: "qux" } };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual(input);
            expect(options).toNotBe(input);
          });
        });
      });

      describe("when scope parameters are present", function() {
        var model, scope;
        beforeEach(function() {
          model = {};
          scope = new Slickback.Scope(model, { foo: "bar", baz: "qux" });
        });

        describe("with no arguments", function() {
          it("returns scope parameters as data object", function() {
            var options = scope.makeFetchOptions();
            expect(options).toEqual({ data: { foo: "bar", baz: "qux" } });
          });
        });

        describe("with an object without a data object", function() {
          it("returns a copy of the object with merged scope", function() {
            var input = { qux: "quxx" };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual({
              qux: "quxx",
              data: { foo: "bar", baz: "qux" }
            });
            expect(input).toEqual({ qux: "quxx" });
          });
        });

        describe("with an object with a blank data object", function() {
          it("returns a copy of the object with merged scope", function() {
            var input = { data: {} };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual({
              data: { foo: "bar", baz: "qux" }
            });
            expect(input).toEqual({ data: {} });
          });
        });

        describe("with an object with a non-blank data object", function() {
          it("returns a copy of the object with merged scope", function() {
            var input = { data: { qux: "quxx" } };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual({
              data: { foo: "bar", baz: "qux", qux: "quxx" }
            });
            expect(input).toEqual({ data: { qux: "quxx" } });
          });
        });

        describe("with an object with data overrides", function() {
          it("returns a copy of the object with merged scope", function() {
            var input = { data: { baz: "quxx" } };
            var options = scope.makeFetchOptions(input);
            expect(options).toEqual({
              data: { foo: "bar", baz: "quxx" }
            });
            expect(input).toEqual({ data: { baz: "quxx" } });
          });
        });
      });
    }); // #makeFetchOptions

    describe("#extend", function() {
      var model;
      beforeEach(function() { model = {}; });

      describe("when scope is blank", function() {
        it("establishes scope parameters", function() {
          var scope = new Slickback.Scope(model);
          scope.extend({ foo: "bar" });
          expect(scope.dataOptions).toEqual({ foo: "bar" });
        });
      });

      describe("when scope is present", function() {
        it("merges scope parameters", function() {
          var scope = new Slickback.Scope(model, { foo: "bar" });
          scope.extend({ baz: "qux" });
          expect(scope.dataOptions).toEqual({ foo: "bar", baz: "qux" });
        });
      });

      describe("when matching scope is present", function() {
        it("replaces scope parameters", function() {
          var scope = new Slickback.Scope(model, { foo: "bar" });
          scope.extend({ foo: "baz" });
          expect(scope.dataOptions).toEqual({ foo: "baz" });
        });
      });
    });

    describe("#scoped", function() {
      var model;
      beforeEach(function() { model = {}; });

      it("copies and returns a new scope", function() {
        var scope = new Slickback.Scope(model, { foo: "bar" });
        var newScope = scope.scoped();
        expect(newScope).toEqual(scope);
        expect(newScope).toNotBe(scope);
      });

      it("merges parameters into new scope", function() {
        var scope = new Slickback.Scope(model, { foo: "bar" });
        var newScope = scope.scoped({ baz: "qux" });

        expect(newScope.dataOptions).toEqual({ foo: "bar", baz: "qux" });
        expect(scope.dataOptions).toEqual({ foo: "bar" });
      });
    }); // #scoped

  }); // Slickback.Scope

}).call(this);
