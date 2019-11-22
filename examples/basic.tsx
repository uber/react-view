import * as React from 'react';
import {Layout, H1, H2, P, Code, Inline} from './layout/';
import {Button, SIZE} from './showcase-components/button';

import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
  PropTypes,
} from '../src';

const Basic = () => {
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
    },
    scope: {
      Button,
      SIZE,
    },
    imports: {
      'your-button-component': {
        named: ['Button'],
      },
    },
  });

  return (
    <Layout>
      <H1>Basic example of useView</H1>
      <P>
        This is our main <a href="https://reactjs.org/docs/hooks-intro.html">hook</a> based API.
        React View strictly separates the UI components from everything else so you can completely
        customize every aspect of the playground. If you want to start as quick as possible, try the{' '}
        <a href="/?path=/story/view--view">View component</a> instead.
      </P>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
      <P>
        This is a basic example that demonstrates all basic features of React View. At the top, you
        can see the <b>rendered component</b>, followed by the <b>middle section with knobs</b> that
        lets you explore all component props, the <b>edittable code snippet</b> and finally some{' '}
        <b>action buttons</b>.
      </P>
      <H2>Usage</H2>
      <Code>
        {`import * as React from 'react';
import {Button, SIZE} from 'your-button-component';

import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
  PropTypes,
} from 'react-view';

const Basic = () => {
  const params = useView({
    componentName: 'Button',
    props: {
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
    },
    scope: {
      Button,
      SIZE,
    },
    imports: {
      'your-button-component': {
        named: ['Button'],
      },
    },
  });

  return (
    <React.Fragment>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </React.Fragment>
  );
}
`}
      </Code>
      <P>
        <b>useView</b> expects a configuration describing your component and returns a
        data-structure that nicely fits into multiple UI components such as Compiler, Error, Knobs,
        Editor and Action Buttons. That gives you the maximum flexibility since you can swap any of
        these components for yours.
      </P>
      <P>
        <b>
          Note that you never have to specify the code snippet since the code is auto-generated
          based on the rest of useView configuration and internal state.
        </b>
      </P>
      <P>
        The biggest part of configuration is a list of <Inline>props</Inline>. You also have to
        explicitely define the <Inline>scope</Inline> (in this case, importing the Button and
        passing it through). On the other hand, the <Inline>imports</Inline> setting is completely
        optional. The imports appear at the top of auto-generated code. That can be nice for your
        users since they will be always able to copy&paste a fully working example.{' '}
      </P>
    </Layout>
  );
};

export default Basic;
