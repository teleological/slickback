(function() {
  "use strict";

  describe("Slickback.IntegerCellEditor", function() {

    var inputElement, column, editor;
    beforeEach(function() {
      inputElement = jasmine.createSpyObj('inputElement',['val']);
      spyOn(Slickback.IntegerCellEditor.prototype,'createTextInputElement').
        andReturn(inputElement);

      column = { mock: 'columnDefinition' };
      editor = new Slickback.IntegerCellEditor({
        container: { mock: 'containerElement' },
        column:    column
      });
    });

    describe("constructor", function() {
      it("creates a text input element", function() {
        expect(Slickback.IntegerCellEditor.prototype.
          createTextInputElement).toHaveBeenCalled();
      });
    });

    describe("#serializeValue", function() {
      it("returns the input element's value as an integer", function() {
        inputElement.val.andReturn("23.9");
        expect(editor.serializeValue()).toBe(23)
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

      describe("when the input value is non-numerical", function() {
        it("considers anything valid", function() {
          inputElement.val.andReturn("inputValue");
          var validation = editor.validate();
          expect(validation.valid).toBeFalsy();
        });
      });
    });

  }); // Slickback.IntegerCellEditor

}).call(this);
