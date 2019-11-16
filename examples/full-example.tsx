import * as React from 'react';
import {Layout} from './layout/';

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

const SIZE = {
  default: 'default',
  compact: 'compact',
  large: 'large',
};

const Button: React.FC<any> = ({children, onClick, size, disabled}) => {
  const getSizeStyle = (size: keyof typeof SIZE) => {
    switch (size) {
      case SIZE.compact:
        return {
          padding: '8px',
          fontSize: '14px',
        };
      case SIZE.large:
        return {
          padding: '18px',
          fontSize: '20px',
        };
      default:
        return {
          padding: '12px',
          fontSize: '16px',
        };
    }
  };
  const btnStyle = {
    ...getSizeStyle(size),
    background: disabled ? '#CCC' : '#276EF1',
    margin: '0px',
    color: disabled ? '#000' : '#FFF',
    borderRadius: '5px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: disabled ? '#CCC' : '#276EF1',
  };
  return (
    <button onClick={onClick} style={btnStyle} disabled={disabled}>
      {children}
    </button>
  );
};

const ViewExample = () => {
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

export default ViewExample;
