import * as React from 'react';
import {Button, KIND, SIZE, SHAPE} from 'baseui/button';
import {PropTypes} from '../src/const';
import {TConfig} from '../src/types';
import Yard from '../src/index';

const ButtonConfig: TConfig = {
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
      placeholder: '() => <span>🦊</span>',
      type: PropTypes.Function,
      description: `A component rendered at the start of the button.`,
    },
    endEnhancer: {
      value: undefined,
      placeholder: '<i>world!</i>',
      type: PropTypes.Function,
      description: `A component rendered at the end of the button.`,
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
      type: PropTypes.Overrides,
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

export default {
  title: 'react-view',
};

export const toStorybook = () => (
  <div>
    <Yard componentName="Button" minHeight={52} {...ButtonConfig} />
  </div>
);

toStorybook.story = {
  name: 'Basic',
};
