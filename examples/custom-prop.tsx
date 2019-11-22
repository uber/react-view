import * as React from 'react';
import template from '@babel/template';

import {Layout, H1, P, Inline} from './layout/';
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
      <H1>Custom Props and Knobs</H1>
      <P>
        <b>React View supports many basic prop types out of the box</b>. Obviously, any prop value
        can be always editted through an input (or a tiny code editor). That's no different than
        writing an actual code. Boring.
      </P>
      <P>
        <b>However, many prop types can be more accessible with a specilized UI</b>. For example,{' '}
        <Inline>boolean</Inline> is always translated into a checkbox and <Inline>enum</Inline> into
        an input radio or select (if we have too many options). Those are much nicer and faster to
        use than inputs.
      </P>
      <P>
        But what if you want to add something custom that we don't support yet? There is a{' '}
        <Inline>customProp</Inline> API that you can use. You can control both the knob and also the
        internal representation of the value. In this example, we add a pretty simple custom knob.
        We want to represent the <Inline>value</Inline> with an input slider.
      </P>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Slider value={params.knobProps.state.value.value as number} set={params.knobProps.set} />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
      <P>
        However, you can go much further. For example, our Base Web component library has this
        concept of <a href="https://baseweb.design/guides/understanding-overrides/">overrides</a>.
        It's a fairly complicated prop that exists on each component and lets you customize every
        aspect of our components. So we have created a whole sub-playground to just better control
        the value of this single prop. Check the{' '}
        <a href="https://baseweb.design/components/button/">Style Override</a> tab on this page.{' '}
      </P>
      <P>
        <b>This is an advanced and very flexible API</b>. For example, you have to be familiar with{' '}
        the concept of <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">AST</a> to use
        it. Check the source code of this page or main README for more details. We will add more
        docs over time.
      </P>
    </Layout>
  );
};

export default StateHook;
