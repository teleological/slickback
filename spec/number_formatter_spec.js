
(function() {
  "use strict";

  describe("Slickback.NumberFormatter", function() {

    var formatter = Slickback.NumberFormatter;
    var row,cell,value; // unused by formatter

    var col,data,formatter;
    beforeEach(function() {
      col       = { field: 'fieldName' };
      data      = jasmine.createSpyObj('model',['get']);
    });

    describe("when column allows null values", function() {
      beforeEach(function() { col.allowNull = true; });

      describe("when data value is null", function() {
        beforeEach(function() { data.get.andReturn(null); });
        it("returns nulls", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe(null);
        });
      });

      describe("when data value is blank", function() {
        beforeEach(function() { data.get.andReturn(""); });
        it("returns nulls", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe(null);
        });
      });
    });

    describe("when column doesn't allow null values", function() {
      beforeEach(function() { col.allowNull = false; });

      describe("when data value is null", function() {
        beforeEach(function() { data.get.andReturn(null); });
        it("returns zero as a string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('0');
        });
      });

      describe("when data value is blank", function() {
        beforeEach(function() { data.get.andReturn(""); });
        it("returns zero as a string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('0');
        });
      });
    });

    describe("when data value is a number", function() {
      beforeEach(function() { data.get.andReturn(12345.67890); });

      describe("when column precision is greater than zero", function() {
        beforeEach(function() { col.precision = 3; });
        it("returns the value as a precision decimal string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12345.679');
        });
      });

      describe("when column precision is zero", function() {
        beforeEach(function() { col.precision = 0; });
        it("returns the value as an integer string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12346');
        });
      });

      describe("when column precision is not defined", function() {
        it("returns the value as an integer string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12346');
        });
      });
    });

    describe("when data value is not a number", function() {
      beforeEach(function() { data.get.andReturn("12345.67890"); });

      describe("when column precision is greater than zero", function() {
        beforeEach(function() { col.precision = 3; });
        it("returns the value as a precision decimal string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12345.679');
        });
      });

      describe("when column precision is zero", function() {
        beforeEach(function() { col.precision = 0; });
        it("returns the value as an integer string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12346');
        });
      });

      describe("when column precision is not defined", function() {
        it("returns the value as an integer string", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('12346');
        });
      });
    });

    describe("when column separation option is true", function() {
      beforeEach(function() { col.separated = true; });
      it("returns a string with thousands separation", function() {
        data.get.andReturn(12345678);
        var formatted = formatter(row,cell,value,col,data);
        expect(formatted).toBe('12,345,678');
      });
    });

    describe("when column separation option is a string", function() {
      beforeEach(function() { col.separated = '.'; });
      it("returns a string with custom thousands separation", function() {
        data.get.andReturn(12345678);
        var formatted = formatter(row,cell,value,col,data);
        expect(formatted).toBe('12.345.678');
      });
    });

  }); // Slickback.NumberFormatter

  describe("Slickback.NumberFormatter.unformat", function() {
    var unformatter = Slickback.NumberFormatter.unformat;

    describe("when column separation option is true", function() {
      it("strips commas", function() {
        expect(unformatter("1,234,567.890",{ separated: true })).
          toEqual("1234567.890");
      });
    });

    describe("when column separation option is a string", function() {
      it("strips the custom thousands separation", function() {
        expect(unformatter("1.234.567.890",{ separated: '.' })).
          toEqual("1234567890");
      });
    });
  });

}).call(this);
