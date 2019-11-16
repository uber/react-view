import * as React from 'react';
import {Layout} from './layout';
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
      disabled: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Indicates that the input is disabled',
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
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </Layout>
  );
};

export default StateHook;
