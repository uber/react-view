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
import ThemeEditor from '../src/base/theme-editor';

import {PropTypes} from '../src/const';
import useView from '../src/view';
import Compiler from '../src/compiler';
import Knobs from '../src/knobs';
import Editor from '../src/editor';
import Error from '../src/error';
import {ActionButtons} from '../src/action-buttons';
import Placeholder from '../src/placeholder';

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
    startEnhancer: {
      value: undefined,
      placeholder: 'Hey',
      type: PropTypes.Function,
      description: `A component rendered at the start of the button.`,
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
  // theme prep
  const [, theme] = useStyletron();
  const initialThemeState = getThemeFromContext(theme, ButtonConfig.theme);
  const themePrimitives =
    theme.name && theme.name.startsWith('dark-theme')
      ? 'darkThemePrimitives'
      : 'lightThemePrimitives';
  // we baby-sit our own theme state
  const [themeState, setThemeState] = React.useState(initialThemeState);

  const params = useView({
    componentName: 'Button',
    props: ButtonConfig.props,
    scope: ButtonConfig.scope,
    imports: ButtonConfig.imports,
    initialProvider: getProvider(themeState, initialThemeState, themePrimitives, setThemeState),
  });
  return (
    <React.Fragment>
      <Compiler {...params.compilerProps} minHeight={48} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <div style={{margin: '10px 0px'}}>
        <ThemeEditor
          theme={themeState}
          themeInit={initialThemeState}
          set={(themeValues: any) => {
            setThemeState(themeValues);
            params.actions.updateProvider(
              getProvider(themeValues, initialThemeState, themePrimitives)
            );
          }}
          componentName="Button"
        />
      </div>
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </React.Fragment>
  );
};

export default ViewExample;
