/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {
  getAstPropsArray,
  getAstPropValue,
  getAstReactHooks,
  getAstImport,
  getAstImports,
  getCode,
} from '../code-generator';
import {PropTypes} from '../const';
import generate from '@babel/generator';
import * as t from '@babel/types';

import {provider} from '../../examples/theming';
import {customProps} from '../../examples/custom-prop';

describe('getAstPropsArray', () => {
  test('boolean (true) and value === defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: true,
            defaultValue: true,
            type: PropTypes.Boolean,
            description: '',
          },
        },
        {}
      )
    ).toEqual([null]);
  });
  test('boolean (false) and value === defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: false,
            defaultValue: false,
            type: PropTypes.Boolean,
            description: '',
          },
        },
        {}
      )
    ).toEqual([null]);
  });
  test('boolean (false) and !defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: false,
            type: PropTypes.Boolean,
            description: '',
          },
        },
        {}
      )
    ).toEqual([null]);
  });
  test('enum and value === defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: 'SIZE.default',
            defaultValue: 'SIZE.default',
            type: PropTypes.Enum,
            description: '',
          },
        },
        {}
      )
    ).toEqual([null]);
  });
  test('!value', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: undefined,
            type: PropTypes.String,
            description: '',
          },
        },
        {}
      )
    ).toEqual([null]);
  });
  test('boolean (true) and value !== defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: true,
            type: PropTypes.Boolean,
            description: '',
          },
        },
        {}
      )
    ).not.toEqual([null]);
  });
  test('enum and value !== defaulValue', () => {
    expect(
      getAstPropsArray(
        {
          a: {
            value: 'SIZE.large',
            defaultValue: 'SIZE.default',
            type: PropTypes.Enum,
            description: '',
          },
        },
        {}
      )
    ).not.toEqual([null]);
  });
});
describe('getAstPropValue', () => {
  test('boolean', () => {
    expect(
      getAstPropValue(
        {
          value: true,
          type: PropTypes.Boolean,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      type: 'BooleanLiteral',
      value: true,
    });
  });
  test('string', () => {
    expect(
      getAstPropValue(
        {
          value: 'Hello',
          type: PropTypes.String,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      type: 'StringLiteral',
      value: 'Hello',
    });
  });
  test('number', () => {
    expect(
      getAstPropValue(
        {
          value: '42',
          type: PropTypes.Number,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      extra: {
        raw: '42',
        rawValue: 42,
      },
      loc: undefined,
      type: 'NumericLiteral',
      value: 42,
    });
  });
  test('enum', () => {
    expect(
      getAstPropValue(
        {
          value: 'SIZE.large',
          type: PropTypes.Enum,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      name: 'SIZE.large',
      type: 'Identifier',
    });
  });
  test('ref', () => {
    expect(
      getAstPropValue(
        {
          value: undefined,
          type: PropTypes.Ref,
          description: '',
        },
        'foo',
        {}
      )
    ).toBe(null);
  });
  test('array', () => {
    expect(
      getAstPropValue(
        {
          value: '[1]',
          type: PropTypes.Array,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      elements: [
        {
          extra: {
            raw: '1',
            rawValue: 1,
          },
          loc: undefined,
          type: 'NumericLiteral',
          value: 1,
        },
      ],
      loc: undefined,
      type: 'ArrayExpression',
    });
  });
  test('object', () => {
    expect(
      getAstPropValue(
        {
          value: `{foo: true}`,
          type: PropTypes.Object,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      body: [
        {
          body: {
            expression: {
              loc: undefined,
              type: 'BooleanLiteral',
              value: true,
            },
            loc: undefined,
            type: 'ExpressionStatement',
          },
          label: {
            loc: undefined,
            name: 'foo',
            type: 'Identifier',
          },
          loc: undefined,
          type: 'LabeledStatement',
        },
      ],
      directives: [],
      loc: undefined,
      type: 'BlockStatement',
    });
  });
  test('React node', () => {
    expect(
      getAstPropValue(
        {
          value: '<div />',
          type: PropTypes.ReactNode,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      children: [],
      closingElement: null,
      loc: undefined,
      openingElement: {
        attributes: [],
        loc: undefined,
        name: {
          loc: undefined,
          name: 'div',
          type: 'JSXIdentifier',
        },
        selfClosing: true,
        type: 'JSXOpeningElement',
      },
      type: 'JSXElement',
    });
  });
  test('function', () => {
    expect(
      getAstPropValue(
        {
          value: '(foo) => {}',
          type: PropTypes.Function,
          description: '',
        },
        'foo',
        {}
      )
    ).toEqual({
      async: false,
      body: {
        body: [],
        directives: [],
        loc: undefined,
        type: 'BlockStatement',
      },
      generator: false,
      loc: undefined,
      params: [
        {
          loc: undefined,
          name: 'foo',
          type: 'Identifier',
        },
      ],
      type: 'ArrowFunctionExpression',
    });
  });
});

describe('getAstReactHooks', () => {
  test('return single value hook', () => {
    expect(
      generate(
        //@ts-ignore
        t.program(
          getAstReactHooks(
            {
              value: {
                value: 'Hey',
                type: PropTypes.String,
                description: '',
                stateful: true,
              },
              foo: {
                value: 'Not stateful',
                type: PropTypes.String,
                description: '',
              },
            },
            {}
          )
        )
      ).code
    ).toBe('const [value, setValue] = React.useState("Hey");');
  });
});

describe('getAstImport', () => {
  test('return multiple named imports', () => {
    expect(
      generate(getAstImport(['Button', 'KIND'], 'baseui/button') as any).code
    ).toBe('import { Button, KIND } from "baseui/button";');
  });
});

describe('getAstImports', () => {
  test('return multiple named and default imports', () => {
    expect(
      generate(
        t.program(
          //@ts-ignore
          getAstImports(
            {
              'baseui/tabs': {
                named: ['Tab'],
                default: 'Root',
              },
              'react-motion': {
                named: ['Motion'],
              },
            },
            {
              'my-provider': {
                named: ['ThemeProvider'],
              },
            },
            {
              a: {
                value: true,
                type: PropTypes.Boolean,
                description: '',
                imports: {
                  'baseui/tabs': {
                    named: ['Tab', 'Tabs'],
                    default: 'OverrideRoot',
                  },
                },
              },
              b: {
                value: undefined,
                type: PropTypes.String,
                description: '',
                imports: {
                  'baseui/button': {
                    named: ['Button'],
                  },
                },
              },
              c: {
                value: 'SIZE.default',
                defaultValue: 'SIZE.default',
                type: PropTypes.Enum,
                description: '',
                imports: {
                  'baseui/button': {
                    named: ['SIZE'],
                  },
                },
              },
              d: {
                value: 'ORIENTATION.vertical',
                defaultValue: 'ORIENTATION.horizontal',
                type: PropTypes.Enum,
                description: '',
                imports: {
                  'baseui/tabs': {
                    named: ['ORIENTATION'],
                  },
                },
              },
            }
          )
        ) as any
      ).code
    ).toBe(`import OverrideRoot, { Tab, Tabs, ORIENTATION } from "baseui/tabs";
import { Motion } from "react-motion";
import { ThemeProvider } from "my-provider";`);
  });
});

describe('getCode', () => {
  test('stateful, hooks enabled component', () => {
    expect(
      getCode({
        props: {
          value: {
            value: 3,
            type: PropTypes.Custom,
            description: `Rating value.`,
            stateful: true,
          },
          onChange: {
            value: 'e => setValue(e.target.value)',
            type: PropTypes.Function,
            description: '',
            propHook: {what: 'e.target.value', into: 'value'},
          },
        },
        componentName: 'Rating',
        providerValue: {inputFill: 'yellow'},
        provider,
        importsConfig: {
          'some-rating': {
            named: ['Rating'],
          },
        },
        customProps,
      })
    ).toBe(`import * as React from "react";
import { Rating } from "some-rating";
import { ThemeProvider } from "your-component-library";

export default () => {
  const [value, setValue] = React.useState(3);
  return (
    <ThemeProvider colors={{ inputFill: "yellow" }}>
      <Rating
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </ThemeProvider>
  );
}`);
  });
});
