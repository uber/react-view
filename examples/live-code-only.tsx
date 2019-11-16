import * as React from 'react';
import {Layout, H1, H2, P, Code, CompilerBox} from './layout/';

// baseui imports
import {Button, KIND, SIZE, SHAPE} from 'baseui/button';

import {useView, Compiler, Editor, Error, ActionButtons} from '../src/';

const initialCode = `export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;

const CodeOnly = () => {
  const params = useView({initialCode, scope: {Button, KIND, SIZE, SHAPE}});
  return (
    <Layout>
      <H1>Live Code Editor</H1>
      <P>
        The useView hook can be also used as a live editor only (no prop knobs or code generation).
        In this mode, it's very similar to{' '}
        <a href="https://github.com/FormidableLabs/react-live">react-live</a>.{' '}
      </P>
      <CompilerBox>
        <Compiler {...params.compilerProps} />
      </CompilerBox>
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <P>
        You can create your UI or re-use components from react-view (Editor, Error...). Optionally
        you can also add the action buttons:
      </P>
      <ActionButtons {...params.actions} />
      <H2>Usage</H2>
      <Code>
        {`import {
  useView,
  Compiler,
  Editor,
  Error,
  ActionButtons
} from 'react-view';

export default () => {
  const params = useView({
    initialCode: '<Button>Hello</Button>',
    scope: {Button: ({children}) => <button>{children}</button>},
    onUpdate: console.log
  });

  return (
    <React.Fragment>
      <Compiler {...params.compilerProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </React.Fragment>
  );
}`}
      </Code>
      <P>
        <b>Note:</b> All import statements are always taken out before compilation.{' '}
        <b>They don't do anything.</b> So feel free to add them if benefical for your users. All
        dependencies need to be passed through the <code>scope</code> prop (React is included
        automatically). Compiler can also handle a naked JSX element or any JavaScript expression.
      </P>
    </Layout>
  );
};

export default CodeOnly;
