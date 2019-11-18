import * as React from 'react';
import {Layout, H1, P, H2, Code} from './layout';

import {Button, SIZE} from './showcase-components/button';

import {View, PropTypes} from '../src';

const ViewExample = () => (
  <Layout>
    <H1>View Component</H1>
    <P>
      A single component that does it all. It composes <code>useView</code> and all UI components
      into one thing. This might be the ideal solution if you don't want to visually tweak anything
      and get started as quick as possible.
    </P>
    <View
      componentName="Button"
      props={{
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
      }}
      scope={{
        Button,
        SIZE,
      }}
      imports={{
        'your-button-component': {
          named: ['Button'],
        },
      }}
    />
    <H2>Usage</H2>
    <Code>
      {`import {View} from 'react-view';
import {Button, SIZE} from 'your-button-component';

export default () => <View
  componentName="Button"
  props={{
    children: {
      value: 'Hello',
      type: PropTypes.ReactNode,
      description: 'Visible label.',
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
    onClick: {
      value: '() => alert("click")',
      type: PropTypes.Function,
      description: 'Function called when button is clicked.',
    },
    disabled: {
      value: false,
      type: PropTypes.Boolean,
      description: 'Indicates that the button is disabled',
    },
  }}
  scope={{
    Button,
    SIZE,
  }}
  imports={{
    'your-button-component': {
      named: ['Button'],
    },
  }}
/>;
`}
    </Code>
  </Layout>
);

export default ViewExample;
