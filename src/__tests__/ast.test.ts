import {transformBeforeCompilation, parse, parseCode} from '../ast';
import {formatAstAndPrint} from '../code-generator';
import {PropTypes} from '../const';

// testing optional provider parser, taken from this example
import {provider} from '../../examples/theming';

describe('transformBeforeCompilation', () => {
  test('remove imports', () => {
    const source = `
      import { Input } from "baseui/input";
      import { foo } from "baz";
      () => <Input value="Hello" />;
    `;
    expect(formatAstAndPrint(transformBeforeCompilation(parse(source), '', {}))).toBe(
      '() => <Input value="Hello" />'
    );
  });

  test('remove exports', () => {
    const source = `
      export default () => <Input value="Hello" />;
    `;
    expect(formatAstAndPrint(transformBeforeCompilation(parse(source), '', {}))).toBe(
      '() => <Input value="Hello" />'
    );
  });

  test('instrument a callback with __react_view_onChange', () => {
    const source = '<Input onChange={e => foo()} />';
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), 'Input', {
          onChange: {
            value: '',
            type: PropTypes.Function,
            description: '',
            propHook: {
              what: 'e.target.value',
              into: 'value',
            },
          },
        })
      )
    ).toBe(`<Input
  onChange={e => {
    foo();
    __react_view_onChange(e.target.value, "value");
  }}
/>`);
  });

  test('instrument a callback with __react_view_onChange (callback return a BlockStatement)', () => {
    const source = '<Input onChange={e => { foo(); baz(); }} />';
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), 'Input', {
          onChange: {
            value: '',
            type: PropTypes.Function,
            description: '',
            propHook: {
              what: 'e.target.value',
              into: 'value',
            },
          },
        })
      )
    ).toBe(`<Input
  onChange={e => {
    foo();
    baz();
    __react_view_onChange(e.target.value, "value")
  }}
/>`);
  });

  test('instrument a children callback with __react_view_onChange', () => {
    const source = '<Foo>{e => foo()}</Foo>';
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), 'Foo', {
          children: {
            value: '',
            type: PropTypes.Function,
            description: '',
            propHook: {
              what: 'e.target.value',
              into: 'value',
            },
          },
        })
      )
    ).toBe(`<Foo>
  {e => {
    foo();
    __react_view_onChange(e.target.value, "value");
  }}
</Foo>`);
  });

  test('instrument a children callback with propHook function', () => {
    const source = '<Foo><button onClick={e => foo()}>Ha</button></Foo>';
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), 'Foo', {
          children: {
            value: '',
            type: PropTypes.Function,
            description: '',
            propHook: ({getInstrumentOnChange, fnBodyAppend}) => ({
              JSXAttribute(path: any) {
                if (path.get('name').node.name === 'onClick') {
                  fnBodyAppend(path.get('value'), getInstrumentOnChange('e.target.value', 'value'));
                }
              },
            }),
          },
        })
      )
    ).toBe(`<Foo>
  <button
    onClick={e => {
      foo();
      __react_view_onChange(e.target.value, "value");
    }}
  >
    Ha
  </button>
</Foo>`);
  });

  test('instrument a callback with propHook function', () => {
    const source = '<Foo render={() => <button onClick={e => foo()}>Ha</button>} />';
    expect(
      formatAstAndPrint(
        transformBeforeCompilation(parse(source), 'Foo', {
          render: {
            value: '',
            type: PropTypes.Function,
            description: '',
            propHook: ({getInstrumentOnChange, fnBodyAppend}) => ({
              JSXAttribute(path: any) {
                if (path.get('name').node.name === 'onClick') {
                  fnBodyAppend(path.get('value'), getInstrumentOnChange('e.target.value', 'value'));
                }
              },
            }),
          },
        })
      )
    ).toBe(`<Foo
  render={() => (
    <button
      onClick={e => {
        foo();
        __react_view_onChange(e.target.value, "value");
      }}
    >
      Ha
    </button>
  )}
/>`);
  });
});

// describe('parseOverrides', () => {
//   test('get overrides active state and value', () => {
//     const overrides = `{
//     Root: {
//       style: ({ $theme }) => {
//         return {
//           outline: \`\${$theme.colors.warning200} solid\`,
//           backgroundColor: $theme.colors.warning200
//         };
//       }
//     }
//   }`;
//     expect(parseOverrides(overrides, ['Root'])).toEqual({
//       Root: {
//         active: true,
//         style: `({ $theme }) => {
//   return {
//     outline: \`\${\$theme.colors.warning200} solid\`,
//     backgroundColor: $theme.colors.warning200
//   };
// }`,
//       },
//     });
//   });
// });

// describe('toggleOverrideSharedProps', () => {
//   test('adding them', () => {
//     const overrides = `{
//     Root: {
//       style: ({ $theme }) => {
//         return {
//           outline: \`\${$theme.colors.warning200} solid\`,
//           backgroundColor: $theme.colors.warning200
//         };
//       }
//     }
//   }`;
//     expect(toggleOverrideSharedProps(overrides, ['$isActive'])).toEqual(`({
//   $theme,
//   $isActive
// }) => {
//   return {
//     outline: \`\${$theme.colors.warning200} solid\`,
//     backgroundColor: $theme.colors.warning200
//   };
// }`);
//   });

//   test('removing them', () => {
//     const overrides = `{
//     Root: {
//       style: ({ $theme, $isActive }) => {
//         return {
//           outline: \`\${$theme.colors.warning200} solid\`,
//           backgroundColor: $theme.colors.warning200
//         };
//       }
//     }
//   }`;
//     expect(toggleOverrideSharedProps(overrides, ['$isActive'])).toEqual(`({
//   $theme
// }) => {
//   return {
//     outline: \`\${$theme.colors.warning200} solid\`,
//     backgroundColor: $theme.colors.warning200
//   };
// }`);
//   });
// });

describe('parseCode', () => {
  test('extract props and theme', () => {
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
              onChange={e => setValue(e.target.value)}
              placeholder="Controlled Input"
            />
          </ThemeProvider>
        );
      }
    `;
    expect(parseCode(fixture, 'Input', provider.parse)).toEqual({
      parsedProps: {
        children: '',
        onChange: 'e => setValue(e.target.value)',
        placeholder: 'Controlled Input',
        value: 'Hello',
      },
      parsedProvider: {
        inputFill: 'yellow',
      },
    });
  });
});
