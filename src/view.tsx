import * as React from 'react';
import copy from 'copy-to-clipboard';

import debounce from 'lodash/debounce';

// transformations, code generation
import {transformBeforeCompilation} from './ast';
import {getCode, formatCode} from './code-generator';
import {buildPropsObj, getThemeForCodeGenerator, countProps} from './utils';
import {TPropValue, TError, TUseView} from './types';

// actions that can be dispatched
import {
  reset,
  updateAll,
  updateCode,
  updateProps,
  updatePropsAndCode,
  updatePropsAndCodeNoRecompile,
} from './actions';
import reducer from './reducer';

const themeState = getThemeForCodeGenerator([], {}, {colors: {}} as any);

const useView: TUseView = ({
  componentName,
  props: propsConfig,
  scope: scopeConfig,
  imports: importsConfig,
  //provider: providerConfig,
  //onUpdate,
  initialCode,
  //providerValues,
  //propTypes: propTypesConfig,
}) => {
  const [hydrated, setHydrated] = React.useState(false);
  const [error, setError] = React.useState<TError>({where: '', msg: null});
  const [state, dispatch] = React.useReducer(reducer, {
    code: initialCode || getCode(propsConfig, componentName, themeState, importsConfig),
    codeNoRecompile: '',
    props: propsConfig,
    theme: {},
  });

  // initialize from the initialCode
  React.useEffect(() => {
    if (initialCode && !hydrated) {
      setHydrated(true);
      try {
        updateAll(dispatch, initialCode, componentName, propsConfig);
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
      themeState,
      importsConfig
    );
    updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
    //updateUrl({ pathname, code: newCode, queryStringName })
  }, 200);

  //const componentThemeDiff = getThemeForCodeGenerator(themeConfig, state.theme, theme);

  const activeProps = countProps(state.props, propsConfig);

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
      activeProps,
      knobProps: state.props,
      error,
      set: (propValue: TPropValue, propName: string) => {
        try {
          !hydrated && setHydrated(true);
          const newCode = getCode(
            buildPropsObj(state.props, {[propName]: propValue}),
            componentName,
            themeState,
            importsConfig
          );
          setError({where: '', msg: null});
          updatePropsAndCode(dispatch, newCode, propName, propValue);
          //updateUrl({ pathname, code: newCode, queryStringName })
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({where: propName, msg: e.toString()});
        }
      },
    },
    providerProps: {},
    editorProps: {
      code: state.codeNoRecompile !== '' ? state.codeNoRecompile : state.code,
      onChange: (newCode: string) => {
        try {
          updateAll(dispatch, newCode, componentName, propsConfig);
          //updateUrl({ pathname, code: newCode, queryStringName })
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
          getCode(propsConfig, componentName, themeState, importsConfig),
          propsConfig,
          {}
        );
      },
    },
  };
};

export default useView;
