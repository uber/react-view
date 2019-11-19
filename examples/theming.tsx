import * as React from 'react';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import {Layout, H3} from './layout';
import {Button, SIZE} from './showcase-components/button';
import ThemeProvider, {defaultTheme} from './showcase-components/theme-provider';

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

const ColorInput: React.FC<TColorInputProps> = ({themeKey, globalSet, globalColor}) => {
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
          onChange={val => {
            setColor(val);
          }}
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
      {themeKeys.map(key => {
        return (
          <ColorInput
            key={key}
            themeKey={key}
            globalColor={activeTheme[key]}
            globalSet={color => {
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
    provider: {
      // define initial provider value
      value: undefined,
      // write a visitor that gets the provider value out of the AST tree
      parse: (astRoot: t.File): TProviderValue => {
        const newThemeValues: Partial<TTheme> = {};
        traverse(astRoot, {
          JSXOpeningElement(path) {
            const identifier = path.node.name as t.JSXIdentifier;
            const attrs = path.node.attributes as t.JSXAttribute[];
            if (identifier.name === 'ThemeProvider' && attrs.length > 0) {
              const colorsAttr = attrs.find(attr => attr.name.name === 'colors');
              if (colorsAttr) {
                const colors = (colorsAttr.value as any).expression.properties;
                colors.forEach((prop: t.ObjectProperty) => {
                  const name: keyof typeof defaultTheme = prop.key.name;
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
                    t.objectProperty(t.identifier(name), t.stringLiteral(value as string))
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
    },
  });

  return (
    <Layout>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ThemeEditor theme={params.providerValue || {}} set={params.actions.updateProvider} />
      <ActionButtons {...params.actions} />
    </Layout>
  );
};

export const getActiveTheme = (
  values: {[key: string]: string},
  initialValues: {[key: string]: string}
) => {
  const activeValues: {[key: string]: string} = {};
  Object.keys(initialValues).forEach(key => {
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
  Object.keys(values).forEach(key => {
    if (initialValues[key] && values[key] && initialValues[key] !== values[key]) {
      diff[key] = values[key];
    }
  });
  return diff;
};

export default Theming;
