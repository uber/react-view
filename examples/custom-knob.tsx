import * as React from 'react';
import {Layout} from './layout';
import {Rating} from './showcase-components/rating';

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
    componentName: 'Rating',
    props: {
      value: {
        value: 3,
        type: PropTypes.Number,
        description: `Rating value.`,
        stateful: true,
      },
      onChange: {
        value: 'value => setValue(value)',
        type: PropTypes.Function,
        description: `Function called when rating value is changed.`,
        propHook: {
          what: 'value',
          into: 'value',
        },
      },
    },
    scope: {
      Rating,
    },
    imports: {
      'your-rating-component': {
        named: ['Rating'],
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
