/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { describe, test, expect } from "vitest";
import { transformBeforeCompilation, parse, parseCode } from "../ast";
import { formatAstAndPrint } from "../code-generator";
import { PropTypes } from "../const";

// testing optional provider parser, taken from this example
import { provider } from "../../examples/theming";

describe("transformBeforeCompilation", () => {
  test("remove imports", () => {
    const source = `
      import { Input } from "baseui/input";
      import { foo } from "baz";
      () => <Input value="Hello" />;
    `;
    expect(
      formatAstAndPrint(transformBeforeCompilation(parse(source), "", {})),
    ).toBe('() => <Input value="Hello" />');
  });

  test("remove exports", () => {
    const source = `
      export default () => <Input value="Hello" />;
    `;
    expect(
      formatAstAndPrint(transformBeforeCompilation(parse(source), "", {})),
    ).toBe('() => <Input value="Hello" />');
  });

  test("instrument a callback with __reactViewOnChange", () => {
    const source = "<Input onChange={e => foo()} />";
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), "Input", {
          onChange: {
            value: "",
            type: PropTypes.Function,
            description: "",
            propHook: {
              what: "e.target.value",
              into: "value",
            },
          },
        }),
      ),
    ).toBe(`<Input
  onChange={e => {
    foo();
    __reactViewOnChange(e.target.value, "value");
  }}
/>`);
  });

  test("instrument a callback with __reactViewOnChange (callback return a BlockStatement)", () => {
    const source = "<Input onChange={e => { foo(); baz(); }} />";
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), "Input", {
          onChange: {
            value: "",
            type: PropTypes.Function,
            description: "",
            propHook: {
              what: "e.target.value",
              into: "value",
            },
          },
        }),
      ),
    ).toBe(`<Input
  onChange={e => {
    foo();
    baz();
    __reactViewOnChange(e.target.value, "value")
  }}
/>`);
  });

  test("instrument a children callback with __reactViewOnChange", () => {
    const source = "<Foo>{e => foo()}</Foo>";
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), "Foo", {
          children: {
            value: "",
            type: PropTypes.Function,
            description: "",
            propHook: {
              what: "e.target.value",
              into: "value",
            },
          },
        }),
      ),
    ).toBe(`<Foo>
  {e => {
    foo();
    __reactViewOnChange(e.target.value, "value");
  }}
</Foo>`);
  });

  test("instrument a children callback with propHook function", () => {
    const source = "<Foo><button onClick={e => foo()}>Ha</button></Foo>";
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), "Foo", {
          children: {
            value: "",
            type: PropTypes.Function,
            description: "",
            propHook: ({ getInstrumentOnChange, fnBodyAppend }) => ({
              JSXAttribute(path: any) {
                if (path.get("name").node.name === "onClick") {
                  fnBodyAppend(
                    path.get("value"),
                    getInstrumentOnChange("e.target.value", "value"),
                  );
                }
              },
            }),
          },
        }),
      ),
    ).toBe(`<Foo>
  <button
    onClick={e => {
      foo();
      __reactViewOnChange(e.target.value, "value");
    }}
  >
    Ha
  </button>
</Foo>`);
  });

  test("instrument a callback with propHook function", () => {
    const source =
      "<Foo render={() => <button onClick={e => foo()}>Ha</button>} />";
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), "Foo", {
          render: {
            value: "",
            type: PropTypes.Function,
            description: "",
            propHook: ({ getInstrumentOnChange, fnBodyAppend }) => ({
              JSXAttribute(path: any) {
                if (path.get("name").node.name === "onClick") {
                  fnBodyAppend(
                    path.get("value"),
                    getInstrumentOnChange("e.target.value", "value"),
                  );
                }
              },
            }),
          },
        }),
      ),
    ).toBe(`<Foo
  render={() => (
    <button
      onClick={e => {
        foo();
        __reactViewOnChange(e.target.value, "value");
      }}
    >
      Ha
    </button>
  )}
/>`);
  });
});

describe("parseCode", () => {
  test("extract props and theme", () => {
    const fixture = `
      import { Input } from "baseui/input";
      
      export default () => {
        const [value, setValue] = React.useState("Hello");
        return (
          <ThemeProvider
            colors={{ inputFill: "yellow" }}
          >
            <Input
              value={value}
              obj={{ foo: true }}
              size={SIZE['a-b']}
              size2={SIZE.a}
              onChange={e => setValue(e.target.value)}
              placeholder="Controlled Input"
            />
          </ThemeProvider>
        );
      }
    `;
    expect(parseCode(fixture, "Input", provider.parse)).toEqual({
      parsedProps: {
        children: "",
        onChange: "e => setValue(e.target.value)",
        placeholder: "Controlled Input",
        value: "Hello",
        size: "SIZE.a-b",
        size2: "SIZE.a",
        obj: "{ foo: true }",
      },
      parsedProvider: {
        inputFill: "yellow",
      },
    });
  });
});
