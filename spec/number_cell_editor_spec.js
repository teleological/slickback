(function() {
  "use strict";

  describe("Slickback.NumberCellEditor", function() {

    var inputElement, column, editor;
    beforeEach(function() {
      inputElement = jasmine.createSpyObj('inputElement',['val']);
      spyOn(Slickback.NumberCellEditor.prototype,'createTextInputElement').
        andReturn(inputElement);

      column = { mock: 'columnDefinition' };
      editor = new Slickback.NumberCellEditor({
        container: { mock: 'containerElement' },
        column:    column
      });
    });

    describe("constructor", function() {
      it("creates a text input element", function() {
        expect(Slickback.NumberCellEditor.prototype.createTextInputElement).
          toHaveBeenCalled();
      });
    });

    describe("#serializeValue", function() {
      describe("when column precision is greater than zero", function() {
        it("returns the input value as a precision string", function() {
          column.precision = 3;
          inputElement.val.andReturn("123.45678");
          expect(editor.serializeValue()).toBe('123.457');
        });
      });

      describe("when column precision is zero", function() {
        it("returns the input element's value as an integer", function() {
          column.precision = 0;
          inputElement.val.andReturn("1234.5678");
          expect(editor.serializeValue()).toBe('1235');
        });
      });

      describe("when column precision is not defined", function() {
        it("returns the input element's value as an integer", function() {
          inputElement.val.andReturn("1234.5678");
          expect(editor.serializeValue()).toBe('1235');
        });
      });

      describe("when formatting is present", function() {
        it("strips the formatting before serializing", function() {
          column.formatter = Slickback.NumberFormatter;
          column.precision = 1;
          column.separated = true;
          inputElement.val.andReturn("123,456.78");
          expect(editor.serializeValue()).toBe('123456.8');
        });
      });
    });

    describe("#validate", function() {
      describe("when the input value is numerical", function() {
        it("considers anything valid", function() {
          inputElement.val.andReturn("3.1415926");
          var validation = editor.validate();
          expect(validation.valid).toBeTruthy();
        });
      });

      describe("when the input value is a formatted numerical", function() {
        it("evaluates the number without the formatting", function() {
          column.formatter = Slickback.NumberFormatter;
          column.precision = 1;
          column.separated = true;
          inputElement.val.andReturn("123,456.78");
          var validation = editor.validate();
          expect(validation.valid).toBeTruthy();
        });
      });

      describe("when the input value is non-numerical", function() {
        it("considers anything invalid", function() {
          inputElement.val.andReturn("inputValue");
          var validation = editor.validate();
          expect(validation.valid).toBeFalsy();
        });
      });
    });

  }); // Slickback.NumberCellEditor

}).call(this);
