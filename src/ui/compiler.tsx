/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import {transformFromAstSync, PluginItem} from '@babel/core';
import * as t from '@babel/types';
//@ts-ignore
import presetReact from '@babel/preset-react';
import {parse} from '../ast';
import {TCompilerProps} from '../index';
import {getStyles} from '../utils';

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

const evalCode = (
  ast: babel.types.Node,
  scope: any,
  presets?: PluginItem[]
) => {
  const transformedCode = transformFromAstSync(
    ast as babel.types.Node,
    undefined,
    {
      presets: presets ? [presetReact, ...presets] : [presetReact],
      inputSourceMap: false as any,
      sourceMaps: false,
      // TS preset needs this and it doesn't seem to matter when TS preset
      // is not used, so let's keep it here?
      filename: 'file.tsx',
    }
  );
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
  errorCallback: (error: Error) => void,
  presets?: PluginItem[]
) => {
  return errorBoundary(evalCode(ast, scope, presets), errorCallback);
};

const transpile = (
  code: string,
  transformations: ((ast: t.File) => t.File)[],
  scope: any,
  setOutput: (params: {component: React.ComponentClass | null}) => void,
  setError: (error: string | null) => void,
  presets?: PluginItem[]
) => {
  try {
    const ast = transformations.reduce(
      (result, transformation) => transformation(result),
      parse(code)
    );
    const component = generateElement(
      ast,
      scope,
      (error: Error) => {
        setError(error.toString());
      },
      presets
    );
    setOutput({component});
    setError(null);
  } catch (error) {
    setError(error.toString());
  }
};

const Compiler: React.FC<TCompilerProps> = ({
  scope,
  code,
  setError,
  transformations,
  placeholder,
  minHeight,
  presets,
  classNames,
}) => {
  const [output, setOutput] = React.useState<{
    component: React.ComponentClass | null;
  }>({component: null});

  React.useEffect(() => {
    transpile(code, transformations, scope, setOutput, setError, presets);
  }, [code]);

  const Element = output.component;
  const Placeholder = placeholder;
  return (
    <div
      {...getStyles(
        {
          minHeight: `${minHeight || 0}px`,
          paddingTop: minHeight ? '16px' : 0,
          paddingBottom: minHeight ? '16px' : 0,
        },
        classNames && classNames.root
      )}
    >
      <div
        {...getStyles(
          {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          },
          classNames && classNames.inner
        )}
      >
        {Element ? (
          <Element />
        ) : Placeholder ? (
          <Placeholder height={minHeight || 32} />
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(
  Compiler,
  (prevProps, nextProps) => prevProps.code === nextProps.code
);
