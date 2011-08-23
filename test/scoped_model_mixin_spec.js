(function() {
  "use strict";

  describe("Slickback.ScopedModelMixin", function() {

    var model;
    beforeEach(function() {
      model = { fetch: jasmine.createSpy("fetch") };
      _.extend(model,Slickback.ScopedModelMixin);
    });

    describe("#scope", function() {
      it("creates a default scope if one is not present", function() {
        var scope = model.scope();
        expect(scope.model).toBe(model);
      });
      it("reuses a default scope if one is present", function() {
        var scope = model.scope();
        expect(scope).toBe(model.scope());
      });
    }); // #scope

    describe("#extendScope", function() {
      it("sets scope data options when none are set", function() {
        model.extendScope({ foo: "bar" });
        expect(model.scope().dataOptions).toEqual({ foo: "bar" });
      });
      it("adds scope data options to preset options", function() {
        model.extendScope({ foo: "bar" });
        model.extendScope({ baz: "qux" });
        expect(model.scope().dataOptions).
          toEqual({ foo: "bar", baz: "qux" });
      });
      it("overrides preset scope options", function() {
        model.extendScope({ foo: "bar" });
        model.extendScope({ foo: "qux" });
        expect(model.scope().dataOptions).toEqual({ foo: "qux" });
      });
    }); // #extendScope

    describe("#clearScope", function() {
      it("resets scope options", function() {
        model.extendScope({ foo: "bar" });
        model.clearScope();
        expect(model.scope().dataOptions).toEqual({});
      });
    }); // #clearScope

    describe("#fetchWithoutScope", function() {
      it("invokes fetch on model with passed options", function() {
        model.extendScope({ foo: "bar" });
        model.fetchWithoutScope({ baz: "qux" });
        expect(model.fetch).
          toHaveBeenCalledWith({ baz: "qux" });
      });
    });

    describe("#fetchWithScope", function() {
      describe("with no passed options", function() {
        it("invokes fetch on model with scope options", function() {
          model.extendScope({ foo: "bar" });
          model.fetchWithScope();
          expect(model.fetch).
            toHaveBeenCalledWith({ data: { foo: "bar" } });
        });
      });

      describe("with passed data options", function() {
        it("invokes model fetch, merging options", function() {
          model.extendScope({ foo: "bar" });
          model.fetchWithScope({ data: { baz: "qux" } });
          expect(model.fetch).
            toHaveBeenCalledWith({ data: { foo: "bar", baz: "qux" } });
        });
      });

      describe("with overriding data options", function() {
        it("invokes model fetch, merging options", function() {
          model.extendScope({ foo: "bar" });
          model.fetchWithScope({ data: { foo: "qux" } });
          expect(model.fetch).
            toHaveBeenCalledWith({ data: { foo: "qux" } });
        });
      });
    }); // #fetchWithScope

    describe("#scoped", function() {
      describe("with no passed options", function() {
        it("clones the default scope", function() {
          model.extendScope({ foo: "bar" });
          var clone = model.scoped();
          expect(clone).toEqual(model.scope());
          expect(clone).toNotBe(model.scope());
        });
      });

      describe("with passed options", function() {
        it("clones the default scope with merged options", function() {
          model.extendScope({ foo: "bar" });
          var clone = model.scoped({ baz: "qux" });
          expect(clone.dataOptions).toEqual({ foo: "bar", baz: "qux" });
        });
      });

      describe("with overriding options", function() {
        it("clones the default scope with overridden options", function() {
          model.extendScope({ foo: "bar" });
          var clone = model.scoped({ foo: "qux" });
          expect(clone.dataOptions).toEqual({ foo: "qux" });
        });
      });
    }); // #scoped

    describe("#installScopedModelDefaults", function() {
      var originalFetch;
      beforeEach(function() {
        originalFetch = model.fetch = jasmine.createSpy("fetch");
        model.installScopedModelDefaults();
      });

      it("replaces fetch with fetchWithScope", function() {
        expect(model.fetch).toBe(model.fetchWithScope);
        expect(model.fetchWithoutScope).toBe(originalFetch);
      });

      it("does not corrupt functions when reinvoked", function() {
        model.installScopedModelDefaults();
        expect(model.fetch).toBe(model.fetchWithScope);
        expect(model.fetchWithoutScope).toBe(originalFetch);
      });
    }); // #installScopedModelDefaults

  }); // Slickback.ScopedModelMixin

}).call(this);
