/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from "react";
import { Layout, H1, H2, P, Code, CompilerBox, Inline } from "./layout/";
import { Button, SIZE } from "./showcase-components/button";

import { useView, Compiler, Editor, Error, ActionButtons } from "../src/";

const initialCode = `export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;

const initialCodeEl = `<Button onClick={() => alert("click")}>Hello</Button>`;
const initialCodeSum = `2 + 5`;

const CodeOnly = () => {
  const params = useView({ initialCode, scope: { Button, SIZE } });
  const paramsEl = useView({
    initialCode: initialCodeEl,
    scope: { Button, SIZE },
  });
  const paramsSum = useView({ initialCode: initialCodeSum });
  return (
    <Layout>
      <H1>Live Code Editor</H1>
      <P>
        The useView hook can be also used as a live editor only (no prop knobs
        or code generation). In this mode, it is very similar to{" "}
        <a href="https://github.com/FormidableLabs/react-live">react-live</a>.{" "}
      </P>
      <CompilerBox>
        <Compiler {...params.compilerProps} />
      </CompilerBox>
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <P>
        You can create your UI or re-use components from react-view (Editor,
        Error...). Optionally you can also add the action buttons:
      </P>
      <ActionButtons {...params.actions} />
      <P>
        <b>This time you do not need to configure a list of props</b>. There are
        no knobs. However, since no code is auto-generated, you should probably
        set the <Inline>intialCode</Inline> so the user sees something besides
        an empty box.
      </P>
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
        <b>Note:</b> All import statements in the editor are always taken out
        before compilation. <b>They do not do anything.</b> Our compiler does
        not understand modules (we do not have a bundler in our flow). So feel
        free to add them if beneficial for your users. All dependencies need to
        be passed through the <Inline>scope</Inline> prop (React is included
        automatically).
      </P>
      <H2>Accepted Code</H2>
      <P>
        The compiler can also handle a <b>React element</b> or class (but we do
        not really use those anymore, do we?).
      </P>
      <CompilerBox>
        <Compiler {...paramsEl.compilerProps} />
      </CompilerBox>
      <Editor {...paramsEl.editorProps} />
      <Error {...paramsEl.errorProps} />
      <P>
        ...or pretty much anything that{" "}
        <b>
          could be executed after the <Inline>return</Inline> statement of JS
          function.
        </b>
      </P>
      <CompilerBox>
        <Compiler {...paramsSum.compilerProps} />
      </CompilerBox>
      <Editor {...paramsSum.editorProps} />
      <Error {...paramsSum.errorProps} />
    </Layout>
  );
};

export default CodeOnly;
