/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import {Layout, H1, H3, P, Inline} from './layout/';
import {Button, SIZE} from './showcase-components/button';
import ThemeProvider, {
  defaultTheme,
} from './showcase-components/theme-provider';

import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
  PropTypes,
  getAstJsxElement,
  useValueDebounce,
} from '../src';

type TTheme = typeof defaultTheme;
type TThemeKeys = keyof TTheme;
type TProviderValue = Partial<TTheme> | undefined;
type TThemeEditorProps = {
  theme: TTheme;
  set: (value: Partial<TTheme> | undefined) => void;
};
type TColorInputProps = {
  themeKey: TThemeKeys;
  globalColor: string;
  globalSet: (color: string) => void;
};

export const getActiveTheme = (
  values: {[key: string]: string},
  initialValues: {[key: string]: string}
) => {
  const activeValues: {[key: string]: string} = {};
  Object.keys(initialValues).forEach((key) => {
    activeValues[key] = initialValues[key];
    if (values && values[key]) {
      activeValues[key] = values[key];
    }
  });
  return activeValues;
};

export const getThemeDiff = (
  values: {[key: string]: string},
  initialValues: {[key: string]: string}
) => {
  const diff: {[key: string]: string} = {};
  Object.keys(values).forEach((key) => {
    if (
      initialValues[key] &&
      values[key] &&
      initialValues[key] !== values[key]
    ) {
      diff[key] = values[key];
    }
  });
  return diff;
};

const ColorInput: React.FC<TColorInputProps> = ({
  themeKey,
  globalSet,
  globalColor,
}) => {
  const [color, setColor] = useValueDebounce<string>(globalColor, globalSet);
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
      }}
    >
      <div style={{width: '160px'}}>
        <Editor
          onChange={(val) => {
            setColor(val);
          }}
          data-testid={themeKey}
          code={color}
          placeholder={defaultTheme[themeKey]}
          language="css"
          small
        />
      </div>
      <div
        style={{
          width: '16px',
          height: '16px',
          marginLeft: '8px',
          border: '1px solid black',
          borderRadius: '5px',
          backgroundColor: color,
        }}
      />
      <div
        title={themeKey}
        style={{
          marginLeft: '8px',
          fontFamily: "'Helvetica Neue', Arial",
          fontSize: '14px',
        }}
      >
        {themeKey}
      </div>
    </label>
  );
};

const ThemeEditor: React.FC<TThemeEditorProps> = ({theme, set}) => {
  const activeTheme = getActiveTheme(theme, defaultTheme);
  const themeKeys = Object.keys(activeTheme) as TThemeKeys[];
  return (
    <React.Fragment>
      <H3>Theme Editor</H3>
      {themeKeys.map((key) => {
        return (
          <ColorInput
            key={key}
            themeKey={key}
            globalColor={activeTheme[key]}
            globalSet={(color) => {
              const diff = getThemeDiff(
                {
                  ...theme,
                  [key]: color,
                },
                defaultTheme
              );
              set(Object.keys(diff).length > 0 ? diff : undefined);
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

export const provider = {
  // define initial provider value
  value: undefined,
  // write a visitor that gets the provider value out of the AST tree
  parse: (astRoot: t.File): TProviderValue => {
    const newThemeValues: Partial<TTheme> = {};
    traverse(astRoot as any, {
      JSXOpeningElement(path) {
        const identifier = path.node.name as t.JSXIdentifier;
        const attrs = path.node.attributes as t.JSXAttribute[];
        if (identifier.name === 'ThemeProvider' && attrs.length > 0) {
          const colorsAttr = attrs.find((attr) => attr.name.name === 'colors');
          if (colorsAttr) {
            const colors = (colorsAttr.value as any).expression.properties;
            colors.forEach((prop: t.ObjectProperty) => {
              const name: keyof typeof defaultTheme = (prop.key as any).name;
              const value = (prop.value as t.StringLiteral).value;
              if (defaultTheme[name] !== value) {
                newThemeValues[name] = value;
              }
            });
          }
        }
      },
    });
    return Object.keys(newThemeValues).length > 0 ? newThemeValues : undefined;
  },
  // write a code generator aka turn the provider value + child subtree into a resulting AST
  generate: (value: TProviderValue, childTree: t.JSXElement) => {
    if (!value || Object.keys(value).length === 0) {
      return childTree;
    }
    return getAstJsxElement(
      'ThemeProvider',
      [
        t.jsxAttribute(
          t.jsxIdentifier('colors'),
          t.jsxExpressionContainer(
            t.objectExpression(
              Object.entries(value).map(([name, value]) =>
                t.objectProperty(
                  t.identifier(name),
                  t.stringLiteral(value as string)
                )
              )
            )
          )
        ),
      ],
      [childTree]
    );
  },
  // import statement that will be displayed when provider value is not undefined
  imports: {
    'your-component-library': {
      named: ['ThemeProvider'],
    },
  },
};

const Theming = () => {
  const params = useView({
    componentName: 'Button',
    props: {
      children: {
        value: 'Hello',
        type: PropTypes.ReactNode,
        description: `Visible label.`,
      },
      size: {
        value: 'SIZE.default',
        defaultValue: 'SIZE.default',
        options: SIZE,
        type: PropTypes.Enum,
        description: 'Defines the size of the button.',
        imports: {
          'your-button-component': {
            named: ['SIZE'],
          },
        },
      },
    },
    scope: {
      Button,
      SIZE,
      ThemeProvider,
    },
    imports: {
      'your-button-component': {
        named: ['Button'],
      },
    },
    provider,
  });

  return (
    <Layout>
      <H1>Theming aka the provider API</H1>
      <P>
        Component libraries often have some theming system. It usually uses the{' '}
        <a href="https://reactjs.org/docs/context.html">React.Context</a> and
        Provider/Consumer APIs. <b>How that works?</b> There is a list of global
        values (colors, fonts, spacing) propagated through the context and each
        component consumes these values through a consumer attached to that
        context.
      </P>
      <P>
        Often, you can also override these context values by adding an
        additional nested provider. Since this is a way how components can be
        visually adjusted,{' '}
        <b>React View has a support for this Consumer/Provider pattern</b>:
      </P>
      <Compiler
        {...params.compilerProps}
        minHeight={62}
        placeholder={Placeholder}
      />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} data-testid="rv-editor" />
      <Error {...params.errorProps} />
      <ThemeEditor
        theme={params.providerValue || {}}
        set={params.actions.updateProvider}
      />
      <ActionButtons {...params.actions} />
      <P>
        The <Inline>ThemeEditor</Inline> is a custom built UI and utilizes the{' '}
        <Inline>provider</Inline> setting. You can see the default values that
        our <Inline>Button</Inline> component consumes. If you change any of
        those, the code generator will wrap the component with the{' '}
        <Inline>ThemeProvider</Inline> component and also add related imports.
      </P>
      <P>
        <b>This is an advanced and very flexible API</b>. For example, you have
        to be familiar with the concept of{' '}
        <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">AST</a> to
        use it. Check the source code of this page or main README for more
        details. We will add more docs over time.
      </P>
    </Layout>
  );
};

export default Theming;
