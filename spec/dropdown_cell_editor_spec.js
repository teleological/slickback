(function() {
  "use strict";

  describe("Slickback.DropdownCellEditor", function() {

    var selector, column, editor;
    beforeEach(function() {
      selector = jasmine.createSpyObj('selector',['val']);
      spyOn(Slickback.DropdownCellEditor.prototype,'createSelectElement').
        andReturn(selector);

      column = { mock: 'columnDefinition' };
      editor = new Slickback.DropdownCellEditor({
        container: { mock: 'containerElement' },
        column:    column
      });
    });

    describe("constructor", function() {
      it("creates a selector element", function() {
        expect(Slickback.DropdownCellEditor.prototype.createSelectElement).
          toHaveBeenCalled();
      });
    });


    describe("#serializeValue", function() {
      it("returns the select element's value", function() {
        selector.val.andReturn("selectValue");
        expect(editor.serializeValue()).toEqual("selectValue");
      });
    });

    describe("#validate", function() {
      it("considers anything valid", function() {
        expect(editor.validate()).toEqual({ valid: true, msg: null });
      });
    });

  }); // Slickback.DropdownCellEditor

}).call(this);
