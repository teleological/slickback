(function() {
  "use strict";

  describe("Slickback.TextCellEditor", function() {

    var inputElement, column, editor;
    beforeEach(function() {
      inputElement = jasmine.createSpyObj('inputElement',['val']);
      spyOn(Slickback.TextCellEditor.prototype,'createTextInputElement').
        andReturn(inputElement);

      column = { mock: 'columnDefinition' };
      editor = new Slickback.TextCellEditor({
        container: { mock: 'containerElement' },
        column:    column
      });
    });

    describe("constructor", function() {
      it("creates a text input element", function() {
        expect(Slickback.TextCellEditor.prototype.createTextInputElement).
          toHaveBeenCalled();
      });
    });

    describe("#serializeValue", function() {
      it("returns the input element's value", function() {
        inputElement.val.andReturn("inputValue");
        expect(editor.serializeValue()).toEqual("inputValue");
      });
    });

    describe("#validate", function() {
      describe("when a column validator is defined", function() {
        it("validates the input element's value", function() {
          var validationFailure = { valid: false, msg: "invalid" };
          column.validator =
            jasmine.createSpy('validator').andReturn(validationFailure);
          inputElement.val.andReturn("inputValue");

          expect(editor.validate()).toEqual(validationFailure);
          expect(column.validator).toHaveBeenCalledWith("inputValue");
        });
      });

      describe("when no column validator is defined", function() {
        it("considers anything valid", function() {
          expect(editor.validate()).toEqual({ valid: true, msg: null });
        });
      });
    });

  }); // Slickback.TextCellEditor

}).call(this);
