import * as React from 'react';

// baseui imports
import {Button, KIND, SIZE, SHAPE} from 'baseui/button';
import {
  useStyletron,
  createTheme,
  lightThemePrimitives,
  darkThemePrimitives,
  ThemeProvider,
} from 'baseui';

// base yard
import {getProvider, getThemeFromContext} from '../src/base/provider';
import {customProps} from '../src/base/custom-props';
import ThemeEditor from '../src/base/theme-editor';
import Overrides from '../src/base/overrides';

import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
  PropTypes,
} from '../src/';

const ButtonConfig = {
  imports: {
    'baseui/button': {
      named: ['Button'],
    },
  },
  scope: {
    Button,
    KIND,
    SIZE,
    SHAPE,
    createTheme,
    lightThemePrimitives,
    darkThemePrimitives,
    ThemeProvider,
  },
  theme: ['buttonPrimaryFill', 'buttonPrimaryText', 'buttonPrimaryHover', 'buttonPrimaryActive'],
  props: {
    children: {
      value: 'Hello',
      type: PropTypes.ReactNode,
      description: `Visible label.`,
    },
    onClick: {
      value: '() => alert("click")',
      type: PropTypes.Function,
      description: `Function called when button is clicked.`,
    },
    disabled: {
      value: false,
      type: PropTypes.Boolean,
      description: 'Indicates that the button is disabled',
    },
    kind: {
      value: 'KIND.primary',
      defaultValue: 'KIND.primary',
      options: KIND,
      type: PropTypes.Enum,
      description: 'Defines the kind (purpose) of a button.',
      imports: {
        'baseui/button': {
          named: ['KIND'],
        },
      },
    },
    shape: {
      value: 'SHAPE.default',
      defaultValue: 'SHAPE.default',
      options: SHAPE,
      type: PropTypes.Enum,
      description: 'Defines the shape of the button.',
      imports: {
        'baseui/button': {
          named: ['SHAPE'],
        },
      },
    },
    size: {
      value: 'SIZE.default',
      defaultValue: 'SIZE.default',
      options: SIZE,
      type: PropTypes.Enum,
      description: 'Defines the size of the button.',
      imports: {
        'baseui/button': {
          named: ['SIZE'],
        },
      },
    },
    isLoading: {
      value: false,
      type: PropTypes.Boolean,
      description: 'Show loading button style and spinner.',
    },
    isSelected: {
      value: false,
      type: PropTypes.Boolean,
      description: 'Indicates that the button is selected.',
    },
    overrides: {
      value: undefined,
      type: PropTypes.Custom,
      description: 'Lets you customize all aspects of the component.',
      names: [
        'BaseButton',
        'EndEnhancer',
        'LoadingSpinner',
        'LoadingSpinnerContainer',
        'StartEnhancer',
      ],
      sharedProps: {
        $kind: 'kind',
        $isSelected: 'isSelected',
        $shape: 'shape',
        $size: 'size',
        $isLoading: 'isLoading',
        $disabled: 'disabled',
      },
    },
  },
};

const ViewExample = () => {
  // theme provider prep
  const [, theme] = useStyletron();
  const componentTheme = getThemeFromContext(theme, ButtonConfig.theme);
  const themePrimitives =
    theme.name && theme.name.startsWith('dark-theme')
      ? 'darkThemePrimitives'
      : 'lightThemePrimitives';
  const provider = getProvider(componentTheme, themePrimitives);

  const params = useView({
    componentName: 'Button',
    props: ButtonConfig.props,
    scope: ButtonConfig.scope,
    imports: ButtonConfig.imports,
    provider,
    customProps,
  });

  return (
    <div style={{maxWidth: '600px', margin: '0px auto'}}>
      <Compiler {...params.compilerProps} minHeight={48} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Overrides
        componentName="Button"
        componentConfig={ButtonConfig.props}
        overrides={params.knobProps.state.overrides}
        set={(propValue: any) => {
          params.knobProps.set(propValue, 'overrides');
        }}
      />
      <div style={{margin: '10px 0px'}}>
        <ThemeEditor
          theme={params.providerState}
          themeInit={componentTheme}
          set={params.actions.updateProvider}
          componentName="Button"
        />
      </div>
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </div>
  );
};

export default ViewExample;
