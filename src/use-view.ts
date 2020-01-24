/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {useState, useReducer, useEffect} from 'react';
import copy from 'copy-to-clipboard';
import debounce from 'lodash/debounce';
import * as t from '@babel/types';

// transformations, code generation
import {transformBeforeCompilation} from './ast';
import {getCode, formatCode} from './code-generator';
import {buildPropsObj} from './utils';
import {TPropValue, TError, TUseView} from './types';

// actions that can be dispatched
import {
  reset,
  updateAll,
  updateCode,
  updateCodeAndProvider,
  updateProps,
  updatePropsAndCode,
  updatePropsAndCodeNoRecompile,
} from './actions';
import reducer from './reducer';

const useView: TUseView = (config = {}) => {
  // setting defaults
  const componentName = config.componentName ? config.componentName : '';
  const propsConfig = config.props ? config.props : {};
  const scopeConfig = config.scope ? config.scope : {};
  const importsConfig = config.imports ? config.imports : {};
  const provider = config.provider
    ? config.provider
    : {
        value: undefined,
        parse: () => undefined,
        generate: (_: any, child: t.JSXElement) => child,
        imports: {},
      };

  const onUpdate = ({code}: {code: string}) => {
    history.replaceState(
      null,
      '',
      `${window.location.search.split('&code')[0]}&code=${encodeURI(code)}`
    );
    config.onUpdate && config.onUpdate({code});
  };

  const urlParams = new URLSearchParams(window.location.search);
  const urlInitialCode = urlParams.get('code');

  const customProps = config.customProps ? config.customProps : {};
  const initialCode = urlInitialCode
    ? decodeURI(urlInitialCode)
    : config.initialCode;

  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<TError>({where: '', msg: null});
  const [state, dispatch] = useReducer(reducer, {
    code:
      initialCode ||
      getCode({
        props: propsConfig,
        componentName,
        provider,
        providerValue: provider.value,
        importsConfig,
        customProps,
      }),
    codeNoRecompile: '',
    props: propsConfig,
    providerValue: provider ? provider.value : undefined,
  });

  // initialize from the initialCode
  useEffect(() => {
    if (initialCode && !hydrated) {
      setHydrated(true);
      try {
        updateAll(
          dispatch,
          initialCode,
          componentName,
          propsConfig,
          provider ? provider.parse : undefined,
          customProps
        );
      } catch (e) {}
    }
  }, [initialCode]);

  // this callback is secretely inserted into props marked with
  // "propHook" this way we can get notified when the internal
  // state of previewed component is changed by user
  const __reactViewOnChange = debounce(
    (propValue: TPropValue, propName: string) => {
      !hydrated && setHydrated(true);
      const newCode = getCode({
        props: buildPropsObj(state.props, {[propName]: propValue}),
        componentName,
        provider,
        providerValue: state.providerValue,
        importsConfig,
        customProps,
      });
      updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
      onUpdate({code: newCode});
    },
    200
  );

  return {
    compilerProps: {
      code: state.code,
      setError: (msg: string | null) => setError({where: '__compiler', msg}),
      transformations: [
        (ast: t.File) =>
          transformBeforeCompilation(ast, componentName, propsConfig),
      ],
      scope: {
        ...scopeConfig,
        __reactViewOnChange,
      },
    },
    knobProps: {
      state: state.props,
      error,
      set: (propValue: TPropValue, propName: string) => {
        try {
          !hydrated && setHydrated(true);
          const newCode = getCode({
            props: buildPropsObj(state.props, {[propName]: propValue}),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps,
          });
          setError({where: '', msg: null});
          updatePropsAndCode(dispatch, newCode, propName, propValue);
          onUpdate({code: newCode});
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({where: propName, msg: e.toString()});
        }
      },
    },
    providerValue: state.providerValue,
    editorProps: {
      code: state.codeNoRecompile !== '' ? state.codeNoRecompile : state.code,
      onChange: (newCode: string) => {
        try {
          updateAll(
            dispatch,
            newCode,
            componentName,
            propsConfig,
            provider ? provider.parse : undefined,
            customProps
          );
          onUpdate({code: newCode});
        } catch (e) {
          updateCode(dispatch, newCode);
        }
      },
    },
    errorProps: {
      msg: error.where === '__compiler' ? error.msg : null,
      code: state.code,
    },
    actions: {
      formatCode: () => {
        updateCode(dispatch, formatCode(state.code));
      },
      copyCode: () => {
        copy(state.code);
      },
      copyUrl: () => {
        copy(window.location.href);
      },
      reset: () => {
        const editorOnlyMode = Object.keys(propsConfig).length === 0;
        const providerValue = provider ? provider.value : undefined;
        const newCode = editorOnlyMode
          ? initialCode
          : getCode({
              props: propsConfig,
              componentName,
              provider,
              providerValue,
              importsConfig,
              customProps,
            });
        reset(dispatch, newCode, providerValue, propsConfig);
        onUpdate({code: newCode});
      },
      updateProvider: (providerValue: any) => {
        const newCode: string = getCode({
          props: buildPropsObj(state.props, {}),
          componentName,
          provider,
          providerValue,
          importsConfig,
          customProps,
        });
        updateCodeAndProvider(dispatch, newCode, providerValue);
      },
      updateProp: (propName: string, propValue: any) => {
        try {
          const newCode = getCode({
            props: buildPropsObj(state.props, {[propName]: propValue}),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps,
          });
          setError({where: '', msg: null});
          updatePropsAndCode(dispatch, newCode, propName, propValue);
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({where: propName, msg: e.toString()});
        }
      },
    },
  };
};

export default useView;
