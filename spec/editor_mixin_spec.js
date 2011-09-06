(function() {
  "use strict";

  describe("Slickback.EditorMixin", function() {

    var editor;
    beforeEach(function() {
      editor = _.extend({ 
        column: {},
        $input: {}
      },Slickback.EditorMixin);
    });

    describe("#createTextInputElement", function() {
      var inputElement;
      beforeEach(function() {
        inputElement = jasmine.createSpyObj('inputElement',[
          'bind','appendTo','focus','select','val'
        ]);
        inputElement.focus.andReturn(inputElement);
        $.andReturn(inputElement);

        editor.container = { mock: 'containerElement' };
        editor.createTextInputElement();
      });

      it("creates a text input element", function() {
        expect($).toHaveBeenCalledWith(/^<input type="text"/);
      });

      it("binds the input element's keydown.nav event", function() {
        expect(inputElement.bind).
          toHaveBeenCalledWith("keydown.nav",jasmine.any(Function));
      });

      it("appends the input element to the container", function() {
        expect(inputElement.appendTo).
          toHaveBeenCalledWith(editor.container);
      });

      it("focuses the input element", function() {
        expect(inputElement.focus).toHaveBeenCalled();
      });

      it("selects the input element", function() {
        expect(inputElement.focus).toHaveBeenCalled();
      });
    });

    describe("#createSelectElement", function() {
      var selector;
      beforeEach(function() {
        selector = jasmine.createSpyObj('selector',[
          'bind','appendTo','focus','val'
        ]);
        $.andReturn(selector);

        editor.container = { mock: 'containerElement' };
        editor.createSelectElement();
      });

      it("creates a select element", function() {
        expect($).toHaveBeenCalledWith('<select>');
      });

      it("appends the select element to the container", function() {
        expect(selector.appendTo).
          toHaveBeenCalledWith(editor.container);
      });

      it("focuses the select element", function() {
        expect(selector.focus).toHaveBeenCalled();
      });
    });

    describe("#destroy", function() {
      it("removes the input element", function() {
        editor.$input.remove = jasmine.createSpy('remove');
        editor.destroy();
        expect(editor.$input.remove).toHaveBeenCalled();
      });
    });

    describe("#focus", function() {
      it("focuses the input element", function() {
        editor.$input.focus = jasmine.createSpy('focus');
        editor.focus();
        expect(editor.$input.focus).toHaveBeenCalled();
      });
    });

    describe("#loadValue", function() {
      var model;
      beforeEach(function() {
        editor.column = { field: 'foo' };

        editor.$input.val = jasmine.createSpy('val');
        editor.$input.select = jasmine.createSpy('select');
        editor.$input[0] = editor.$input;

        model = jasmine.createSpyObj('model',['get']);
        model.get.andReturn('bar');
      });

      describe("when a formatter is defined", function() {
        beforeEach(function() {
          editor.column.formatter = function() { return 'qux' };
        });

        it("sets editor's default value to formatted value", function() {
          editor.loadValue(model);
          expect(editor.defaultValue).toEqual('qux');
        });

        it("sets input's value to formatted value", function() {
          editor.loadValue(model);
          expect(editor.$input.val).toHaveBeenCalledWith('qux');
        });

        it("sets inputs's default value to formatted value", function() {
          editor.loadValue(model);
          expect(editor.$input.defaultValue).toEqual('qux');
        });
      });

      describe("when no formatter is defined", function() {
        it("sets editor's default value to column model value", function() {
          editor.loadValue(model);
          expect(editor.defaultValue).toEqual('bar');
        });

        it("sets input's value to column model value", function() {
          editor.loadValue(model);
          expect(model.get).toHaveBeenCalledWith('foo');
          expect(editor.$input.val).toHaveBeenCalledWith('bar');
        });

        it("sets inputs's default value to column model value", function() {
          editor.loadValue(model);
          expect(editor.$input.defaultValue).toEqual('bar');
        });
      });

      it("selects the input element", function() {
        editor.loadValue(model);
        expect(editor.$input.select).toHaveBeenCalled();
      });
    });

    describe("#applyValue", function() {
      var model;
      beforeEach(function() {
        editor.column = { field: 'foo' };
        model = jasmine.createSpyObj('model',['set']);
      });

      it("uses value to set column field for the given model", function() {
        editor.applyValue(model,'baz')
        expect(model.set).toHaveBeenCalledWith({ foo: 'baz' });
      });
    });

    describe("#isValueChanged", function() {
      beforeEach(function() {
        editor.$input.val = jasmine.createSpy('val');
      });

      describe("when input value != editor default", function() {
        describe("when input value is present", function() {
          // i.e. input value added
          it("returns true", function() {
            editor.$input.val.andReturn('foo');
            expect(editor.isValueChanged()).toBeTruthy();
          });
        });

        describe("when editor default value is not null", function() {
          // i.e. input value deleted
          it("returns true", function() {
            editor.defaultValue = 'foo'
            expect(editor.isValueChanged()).toBeTruthy();
          });
        });
      });

     describe("when input value == editor default", function() {
        describe("when input value/default value are present", function() {
          it("returns false", function() {
            editor.$input.val.andReturn('foo');
            editor.defaultValue = 'foo'
            expect(editor.isValueChanged()).toBeFalsy();
          });
        });

        describe("when input is blank and editor default null", function() {
          it("returns false", function() {
            expect(editor.isValueChanged()).toBeFalsy();
          });
        });
      });
    });

    describe("#formattedModelValue", function() {
      describe("when a formatter is defined", function() {
        it("returns the formatted value for the model's field", function() {
          var formatter = jasmine.createSpy('formatter').andReturn('qux');
          editor.column.formatter = formatter;
          expect(editor.formattedModelValue({})).toEqual('qux');
        });
      });

      describe("when no formatter is defined", function() {
        it("returns the model's unformatted field value", function() {
          var model = {
            get: jasmine.createSpy('formatter').andReturn('baz')
          };
          expect(editor.formattedModelValue(model)).toEqual('baz');
        });
      });
    });

    describe("#unformattedInputValue", function() {
      describe("when a reversible formatter is defined", function() {
        it("returns the input value, unformatted", function() {
          var unformatter =
            jasmine.createSpy('unformatter').andReturn('foo');
          editor.column.formatter = { unformat: unformatter };
          editor.$input.val = jasmine.createSpy('val').andReturn('bar');

          expect(editor.unformattedInputValue()).toEqual('foo');
          expect(unformatter).toHaveBeenCalledWith('bar',editor.column);
        });
      });

      describe("when a non-reversible formatter is defined", function() {
        it("returns the input value without transformation", function() {
          editor.column.formatter = function(){}; // look ma, no unformat
          editor.$input.val = jasmine.createSpy('val').andReturn('bar');

          expect(editor.unformattedInputValue()).toEqual('bar');
        });
      });

      describe("when no formatter is defined", function() {
        it("returns the input value without transformation", function() {
          editor.$input.val = jasmine.createSpy('val').andReturn('bar');
          expect(editor.unformattedInputValue()).toEqual('bar');
        });
      });
    });

  }); // Slickback.EditorMixin

}).call(this);
