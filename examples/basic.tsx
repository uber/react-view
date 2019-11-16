import * as React from 'react';
import {Layout} from './layout';
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
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </Layout>
  );
};

export default Basic;
