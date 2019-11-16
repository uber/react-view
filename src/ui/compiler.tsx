import React from 'react';
import {transformFromAstSync} from '@babel/core';
//@ts-ignore
import presetReact from '@babel/preset-react';
import {parse} from '../ast';

const errorBoundary = (
  Element: React.FC | React.ComponentClass | undefined,
  errorCallback: (error: Error) => void
) => {
  class ErrorBoundary extends React.Component {
    componentDidCatch(error: Error) {
      errorCallback(error);
    }
    render() {
      if (typeof Element === 'undefined') return null;
      return typeof Element === 'function' ? <Element /> : Element;
    }
  }
  return ErrorBoundary;
};

const evalCode = (ast: babel.types.Node, scope: any) => {
  const transformedCode = transformFromAstSync(ast as babel.types.Node, undefined, {
    presets: [presetReact],
    inputSourceMap: false as any,
    sourceMaps: false,
  });
  const resultCode = transformedCode ? transformedCode.code : '';
  const scopeKeys = Object.keys(scope);
  const scopeValues = Object.values(scope);
  //@ts-ignore
  const res = new Function('React', ...scopeKeys, `return ${resultCode}`);
  return res(React, ...scopeValues);
};

const generateElement = (
  ast: babel.types.Node,
  scope: any,
  errorCallback: (error: Error) => void
) => {
  return errorBoundary(evalCode(ast, scope), errorCallback);
};

const transpile = (
  code: string,
  transformations: ((ast: babel.types.Node) => babel.types.Node)[],
  scope: any,
  setOutput: (params: {component: React.ComponentClass | null}) => void,
  setError: (error: string | null) => void
) => {
  try {
    const ast = transformations.reduce((result, transformation) => transformation(result), parse(
      code
    ) as babel.types.Node);
    const component = generateElement(ast, scope, (error: Error) => {
      setError(error.toString());
    });
    setOutput({component});
    setError(null);
  } catch (error) {
    setError(error.toString());
  }
};

const Compiler: React.FC<{
  scope: any;
  code: string;
  minHeight?: number;
  setError: (error: string | null) => void;
  transformations: ((ast: babel.types.Node) => babel.types.Node)[];
  placeholder?: React.FC<{height: number}>;
}> = ({scope, code, setError, transformations, placeholder, minHeight}) => {
  const [output, setOutput] = React.useState<{
    component: React.ComponentClass | null;
  }>({component: null});

  React.useEffect(() => {
    transpile(code, transformations, scope, setOutput, setError);
  }, [code]);

  const Element = output.component;
  const Placeholder = placeholder;
  return (
    <div
      style={{
        minHeight: `${minHeight || 0}px`,
        paddingTop: minHeight ? '16px' : 0,
        paddingBottom: minHeight ? '16px' : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {Element ? <Element /> : Placeholder ? <Placeholder height={minHeight || 32} /> : null}
      </div>
    </div>
  );
};

export default React.memo(Compiler, (prevProps, nextProps) => prevProps.code === nextProps.code);
