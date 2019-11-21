import * as React from 'react';
import template from '@babel/template';

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
  useValueDebounce,
} from '../src';

export const customProps = {
  value: {
    // define how to convert value into an AST tree
    generate: (value: number) => {
      return (template.ast(String(value), {plugins: ['jsx']}) as any).expression;
    },
    // define how to convert the JSX attribute value into value
    parse: (code: string) => {
      return parseInt(code, 10);
    },
  },
};

// custom knob component
const Slider: React.FC<{value: number; set: (val: number, propName: string) => void}> = ({
  value,
  set,
}) => {
  // debouncing the knob value so it's always interactive
  const [rangeValue, setRangeValue] = useValueDebounce(value, val => set(val, 'value'));
  return (
    <React.Fragment>
      <label
        style={{
          fontWeight: 500,
          fontSize: '14px',
          fontFamily: "'Helvetica Neue', Arial",
        }}
      >
        <p>Custom knob for the custom value prop</p>
        <input
          style={{width: '284px'}}
          list="tickmarks"
          type="range"
          min="1"
          max="5"
          step="1"
          value={rangeValue as number}
          onChange={e => {
            setRangeValue(parseInt(e.target.value, 10));
          }}
        />
        <datalist id="tickmarks">
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option value="4" />
          <option value="5" />
        </datalist>
      </label>
    </React.Fragment>
  );
};

const StateHook = () => {
  const params = useView({
    componentName: 'Rating',
    props: {
      value: {
        value: 3,
        // mark the prop as type custom so it's not processed by react-view
        type: PropTypes.Custom,
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
    customProps,
  });

  return (
    <Layout>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Slider value={params.knobProps.state.value.value as number} set={params.knobProps.set} />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </Layout>
  );
};

export default StateHook;
