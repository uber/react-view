import * as React from 'react';
import {Layout, H1, H2, P, Code, Inline} from './layout/';
import {Input, SIZE} from './showcase-components/input';

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

const StateHook = () => {
  const params = useView({
    componentName: 'Input',
    props: {
      value: {
        value: 'Hello',
        type: PropTypes.String,
        description: `Input value.`,
        stateful: true,
      },
      size: {
        value: 'SIZE.default',
        defaultValue: 'SIZE.default',
        options: SIZE,
        type: PropTypes.Enum,
        description: 'Defines the size of the button.',
        imports: {
          'your-input-component': {
            named: ['SIZE'],
          },
        },
      },
      onChange: {
        value: 'e => setValue(e.target.value)',
        type: PropTypes.Function,
        description: `Function called when input value is changed.`,
        propHook: {
          what: 'e.target.value',
          into: 'value',
        },
      },
      editable: {
        value: true,
        defaultValue: true,
        type: PropTypes.Boolean,
        description: 'Indicates that the input is editable.',
      },
    },
    scope: {
      Input,
      SIZE,
    },
    imports: {
      'your-input-component': {
        named: ['Input'],
      },
    },
  });

  return (
    <Layout>
      <H1>State Hook</H1>
      <P>
        Not all components are as simple as buttons. The most of React
        components have some sort of state. For example, inputs have the{' '}
        <b>value</b> state. By default, React View treats everything as{' '}
        <a href="https://reactjs.org/docs/forms.html#controlled-components">
          controlled components
        </a>
        . So when you specify the list of props in useView, you will get the
        output like this:
      </P>
      <Code>{`<Input value="Hello" onChange={console.log} />
`}</Code>
      <P>
        And that works. You can still update the value by changing the value
        knob or editing the code directly.{' '}
        <b>
          However, you would not be able to interact with the component itself
        </b>{' '}
        since the value is hard-coded - the component is controlled. The code
        above is also not very realistic. How often do we create non editable
        inputs?
      </P>
      <P>
        Fortunately, React View has special{' '}
        <b>
          <Inline>propHook</Inline>
        </b>{' '}
        and{' '}
        <b>
          <Inline>stateful</Inline>
        </b>{' '}
        settings so you can achieve full interactivity:
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
      <ActionButtons {...params.actions} />
      <P>
        The example above has its <b>own internal value state</b> (using{' '}
        <a href="https://reactjs.org/docs/hooks-reference.html#usestate">
          React.useState
        </a>
        ) and the value knob is now translated into its initial internal state.
        Now you can interact with the component itself and{' '}
        <b>everything is still synchronized</b>. Moreover, the code snippet now
        also better demonstrates the real-world usage.
      </P>
      <H2>Usage</H2>
      <Code>{`import * as React from 'react';
import {Input, SIZE} from 'your-input-component';

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

const StateHook = () => {
  const params = useView({
    componentName: 'Input',
    props: {
      value: {
        value: 'Hello',
        type: PropTypes.String,
        description: 'Input value.',
        stateful: true,
      },
      size: {
        value: 'SIZE.default',
        defaultValue: 'SIZE.default',
        options: SIZE,
        type: PropTypes.Enum,
        description: 'Defines the size of the button.',
        imports: {
          'your-input-component': {
            named: ['SIZE'],
          },
        },
      },
      onChange: {
        value: 'e => setValue(e.target.value)',
        type: PropTypes.Function,
        description: 'Function called when input value is changed.',
        propHook: {
          what: 'e.target.value',
          into: 'value',
        },
      },
      editable: {
        value: true,
        defaultValue: true,
        type: PropTypes.Boolean,
        description: 'Indicates that the input is editable.',
      },
    },
    scope: {
      Input,
      SIZE,
    },
    imports: {
      'your-input-component': {
        named: ['Input'],
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
};`}</Code>
      <P>
        There are just two changes that we have to make compared to the{' '}
        <a href="/?path=/story/useview--basic">basic example</a>. First, we have
        to detach the value prop into an internal state. We simply add the{' '}
        <b>
          <Inline>stateful</Inline> flag
        </b>
        :
      </P>
      <Code>{`useView({
  props: {
    value: {
      value: 'Hello',
      type: PropTypes.String,
      stateful: true,
    },
  /* ... */
  }
})
`}</Code>
      <P>
        At this point,{' '}
        <b>the value is detached and rendered input is fully interactive</b>.
        However, the changes are not synchronized with the rest of the
        playground. We need to give React View a slight hint:{' '}
      </P>
      <Code>
        {`onChange: {
  value: 'e => setValue(e.target.value)',
  type: PropTypes.Function,
  propHook: {
    what: 'e.target.value',
    into: 'value',
  },
}
`}
      </Code>
      <P>
        We have added the{' '}
        <b>
          <Inline>propHook.what</Inline>
        </b>{' '}
        and{' '}
        <b>
          <Inline>propHook.into</Inline>
        </b>{' '}
        in the <Inline>onChange</Inline> prop. We are telling React View{' '}
        <Inline>what</Inline> value it should use and <Inline>into</Inline> what
        stateful prop it should go. Note that this setting also depends on the
        initial value of <Inline>onChange</Inline> prop since React View
        secretly adds an instrumentation call into the body of{' '}
        <Inline>e &gt; setValue(e.target.value)</Inline> function.
      </P>
      <H2>defaultValue</H2>
      <P>
        Props can have a <Inline>defaultValue</Inline>. That is useful for an{' '}
        <Inline>enum</Inline> so the code generator knows when to skip the
        default option. Sometimes you can also have a <Inline>boolean</Inline>{' '}
        prop that treats <Inline>undefined</Inline> the opposite way to{' '}
        <Inline>false</Inline>. In the example above, this inverted behavior is
        demonstrated with the prop <Inline>editable</Inline>:
      </P>
      <Code>{`editable: {
  value: true,
  defaultValue: true,
  type: PropTypes.Boolean,
  description: 'Indicates that the input is editable.',
}`}</Code>
    </Layout>
  );
};

export default StateHook;
