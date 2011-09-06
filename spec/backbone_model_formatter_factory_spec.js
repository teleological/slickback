(function() {
  "use strict";

  describe("Slickback.BackboneModelFormatterFactory", function() {

    describe(".getFormatter", function() {
      it("returns a field-based formatter for a column", function() {
        var model = {
          attributes: { foo: "bar", baz: "qux" },
          get: function(field) { return this.attributes[field]; }
        };
        var column = { field: "foo" };
        var formatter =
          Slickback.BackboneModelFormatterFactory.getFormatter(column);
        expect(formatter(0,0,null,column,model)).toEqual("bar");
      });
    }); // #getFormatter

  }); // Slickback.BackboneModelFormatterFactory

}).call(this);
