
(function() {
  "use strict";

  describe("Slickback.ChoiceFormatter", function() {

    var formatter = Slickback.ChoiceFormatter;
    var row,cell,value; // unused by formatter

    var col,data,formatter;

    beforeEach(function() {
      data = jasmine.createSpyObj('model',['get']); 
    });

    describe("when choices are defined as simple values", function() {
      beforeEach(function() {
        col = {
          field: 'fieldName',
          choices: [ 'foo', 'bar', 'baz', 'qux' ]
        };
      });

      describe("when select value is one of choices", function() {
        beforeEach(function() { data.get.andReturn('foo'); });
        it("returns the selected value", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('foo');
        });
      });

      describe("when select value is not one of choices", function() {
        beforeEach(function() { data.get.andReturn(''); });
        describe("when includeBlank is true", function() {
          it("returns a blank string", function() {
            col.includeBlank = true;
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('');
          });
        });
        describe("when includeBlank is not defined", function() {
          it("returns a blank string", function() {
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('');
          });
        });
        describe("when includeBlank is defined as string", function() {
          it("returns the includeBlank value", function() {
            col.includeBlank = 'bar'
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('bar');
          });
        });
      });
    });

    describe("when choices are defined with integer values", function() {
      beforeEach(function() {
        col = {
          field: 'fieldName',
          choices: [
            { label: 'foo', value: 1 },
            { label: 'bar', value: 2 },
            { label: 'baz', value: 3 },
            { label: 'qux', value: 4 }
          ]
        };
      });

      describe("when selected value is one of choices", function() {
        beforeEach(function() { data.get.andReturn(3); });
        it("returns the label for selected value", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('baz');
        });
      });

      describe("when selected value is string value of choice", function() {
        beforeEach(function() { data.get.andReturn('3'); });
        it("returns the label for selected value", function() {
          var formatted = formatter(row,cell,value,col,data);
          expect(formatted).toBe('baz');
        });
      });

      describe("when selected value is not one of choices", function() {
        beforeEach(function() { data.get.andReturn(''); });
        describe("when includeBlank is true", function() {
          it("returns a blank string", function() {
            col.includeBlank = true;
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('');
          });
        });
        describe("when includeBlank is not defined", function() {
          it("returns a blank string", function() {
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('');
          });
        });
        describe("when includeBlank is defined as string", function() {
          it("returns a blank string", function() {
            col.includeBlank = 'shazam';
            var formatted = formatter(row,cell,value,col,data);
            expect(formatted).toBe('shazam');
          });
        });
      });
    });

  }); // Slickback.ChoiceFormatter

}).call(this);
