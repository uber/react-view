import * as React from 'react';
import {Layout, H1, P, H2, Code, Inline} from './layout';

import {Button, SIZE} from './showcase-components/button';

import {View, PropTypes} from '../src';

const ViewExample = () => (
  <Layout>
    <H1>View Component</H1>
    <P>
      <b>A single component that does it all</b>. It is a tiny wrapper around
      the <a href="/?path=/story/useview--basic">useView</a> hook and composes
      all UI components into one thing. This might be an ideal solution if you
      do not want to visually tweak anything and just get started as quick as
      possible.
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
    <P>
      If you are building your own playground based on <Inline>useView</Inline>,
      having component like this can be a good way how to share it with others.
    </P>
  </Layout>
);

export default ViewExample;
