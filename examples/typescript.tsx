import * as React from 'react';
import {Layout, H1, H2, P, Code, CompilerBox} from './layout/';

//@ts-ignore
import presetTypescript from '@babel/preset-typescript';

import {useView, Compiler, Editor, Error} from '../src/';

const initialCode = `() => {
  const text: string = "Typed";
  return <h2>{text}</h2>;
}`;

const TypescriptCodeOnly = () => {
  const params = useView({initialCode});
  return (
    <Layout>
      <H1>TypeScript Support</H1>
      <P>
        We use babel to compile the code that user passes to the editor. By default, we apply only{' '}
        <a href="https://babeljs.io/docs/en/babel-preset-react">@babel/preset-react</a> but you can
        import and use additional babel plugins. Do you want to support{' '}
        <a href="https://flow.org/">Flow</a>? Add{' '}
        <a href="@babel/preset-flow">@babel/preset-flow</a> instead.
      </P>
      <P>
        In this case, we have added{' '}
        <a href="https://babeljs.io/docs/en/babel-preset-typescript">@babel/preset-typescript</a> to
        support TypeScript. This preset strips out all the TypeScript code but it doesn't validate
        types.
      </P>
      <CompilerBox>
        <Compiler {...params.compilerProps} presets={[presetTypescript]} />
      </CompilerBox>
      <Editor {...params.editorProps} language="tsx" />
      <Error {...params.errorProps} />
      <H2>Usage</H2>
      <P>
        The compiler component accepts an optional array of presets. You should also set the editor
        language to TSX to get a proper syntax highlighting.
      </P>
      <Code>
        {`import {useView, Compiler, Editor, Error} from 'react-view';
import presetTypescript from '@babel/preset-typescript';

export default () => {
  const params = useView({
    initialCode: \`() => {
      const text: string = "Typed";
      return <h2>{text}</h2>;
    }\`,
    scope: {},
    onUpdate: console.log
  });

  return (
    <React.Fragment>
      <Compiler
        {...params.compilerProps}
        presets={[presetTypescript]}
      />
      <Editor {...params.editorProps} language="tsx" />
      <Error {...params.errorProps} />
    </React.Fragment>
  );
}`}
      </Code>
      <P>
        <b>Note:</b> If you use react-view in the full mode (with the code-generation), we currently
        generate only plain JavaScript. The reason is that our examples simply don't need any type
        annotations since both TypeScript and Flow can infer 100% of them. So you can take the same
        output and copy&paste it into a JS, TS or Flow codebase without any changes.
      </P>
    </Layout>
  );
};

export default TypescriptCodeOnly;
