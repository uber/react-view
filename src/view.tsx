import * as React from 'react';
import copy from 'copy-to-clipboard';

import debounce from 'lodash/debounce';

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

const useView: TUseView = ({
  componentName,
  props: propsConfig,
  scope: scopeConfig,
  imports: importsConfig,
  provider,
  onUpdate,
  initialCode,
  customProps,
}) => {
  const [hydrated, setHydrated] = React.useState(false);
  const [error, setError] = React.useState<TError>({where: '', msg: null});
  const [state, dispatch] = React.useReducer(reducer, {
    code:
      initialCode ||
      getCode(
        propsConfig,
        componentName,
        provider,
        provider ? provider.value : undefined,
        importsConfig,
        customProps
      ),
    codeNoRecompile: '',
    props: propsConfig,
    providerValue: provider ? provider.value : undefined,
  });

  // initialize from the initialCode
  React.useEffect(() => {
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
  const __yard_onChange = debounce((propValue: TPropValue, propName: string) => {
    !hydrated && setHydrated(true);
    const newCode = getCode(
      buildPropsObj(state.props, {[propName]: propValue}),
      componentName,
      provider,
      state.providerValue,
      importsConfig,
      customProps
    );
    updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
    onUpdate && onUpdate({code: newCode});
  }, 200);

  return {
    compilerProps: {
      code: state.code,
      setError: (msg: string) => setError({where: '__compiler', msg}),
      transformations: [
        (code: string) => transformBeforeCompilation(code, componentName, propsConfig),
      ],
      scope: {
        ...scopeConfig,
        __yard_onChange,
      },
    },
    knobProps: {
      state: state.props,
      error,
      set: (propValue: TPropValue, propName: string) => {
        try {
          !hydrated && setHydrated(true);
          const newCode = getCode(
            buildPropsObj(state.props, {[propName]: propValue}),
            componentName,
            provider,
            state.providerValue,
            importsConfig,
            customProps
          );
          setError({where: '', msg: null});
          updatePropsAndCode(dispatch, newCode, propName, propValue);
          onUpdate && onUpdate({code: newCode});
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({where: propName, msg: e.toString()});
        }
      },
    },
    providerState: state.providerValue,
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
          onUpdate && onUpdate({code: newCode});
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
        reset(
          dispatch,
          getCode(
            propsConfig,
            componentName,
            provider,
            state.providerValue,
            importsConfig,
            customProps
          ),
          propsConfig
        );
      },
      updateProvider: (providerValue: any) => {
        const newCode: string = getCode(
          buildPropsObj(state.props, {}),
          componentName,
          provider,
          providerValue,
          importsConfig,
          customProps
        );
        updateCodeAndProvider(dispatch, newCode, providerValue);
      },
      updateProp: (propName: string, propValue: any) => {
        try {
          const newCode = getCode(
            buildPropsObj(state.props, {[propName]: propValue}),
            componentName,
            provider,
            state.providerValue,
            importsConfig,
            customProps
          );
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
