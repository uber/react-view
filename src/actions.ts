// import Router from 'next/router';
import {parseCode, parseOverrides} from './ast';
import {Action, PropTypes} from './const';
import {TProp, TDispatch, TPropValue} from './types';

export const updateCode = (dispatch: TDispatch, newCode: string) => {
  dispatch({
    type: Action.UpdateCode,
    payload: newCode,
  });
};

export const updateAll = (
  dispatch: TDispatch,
  newCode: string,
  componentName: string,
  propsConfig: {[key: string]: TProp},
  parseProvider?: (ast: any) => void
) => {
  const propValues: {[key: string]: TPropValue} = {};
  const {parsedProps} = parseCode(newCode, componentName, parseProvider);
  Object.keys(propsConfig).forEach(name => {
    propValues[name] = propsConfig[name].value;
    if (name === 'overrides') {
      // overrides need a special treatment since the value needs to
      // be further analyzed and parsed
      propValues[name] = parseOverrides(
        parsedProps[name],
        propsConfig.overrides ? propsConfig.overrides.names || [] : []
      );
    } else if (propsConfig[name].type === PropTypes.Date) {
      const match = parsedProps[name].match(/^new\s*Date\(\s*"([0-9-T:.Z]+)"\s*\)$/);
      if (match) {
        propValues[name] = match[1];
      } else {
        propValues[name] = parsedProps[name];
      }
    } else {
      propValues[name] = parsedProps[name];
    }
  });
  dispatch({
    type: Action.Update,
    payload: {
      code: newCode,
      updatedPropValues: propValues,
    },
  });
};

export const updatePropsAndCodeNoRecompile = (
  dispatch: TDispatch,
  newCode: string,
  propName: string,
  propValue: TPropValue
) => {
  dispatch({
    type: Action.UpdatePropsAndCodeNoRecompile,
    payload: {
      codeNoRecompile: newCode,
      updatedPropValues: {[propName]: propValue},
    },
  });
};

export const updatePropsAndCode = (
  dispatch: TDispatch,
  newCode: string,
  propName: string,
  propValue: TPropValue
) => {
  dispatch({
    type: Action.UpdatePropsAndCode,
    payload: {
      code: newCode,
      updatedPropValues: {[propName]: propValue},
    },
  });
};

export const updateProps = (dispatch: TDispatch, propName: string, propValue: TPropValue) => {
  dispatch({
    type: Action.UpdateProps,
    payload: {[propName]: propValue},
  });
};

export const reset = (
  dispatch: TDispatch,
  initialCode: string,
  propsConfig: {[key: string]: TProp}
) => {
  dispatch({
    type: Action.Reset,
    payload: {
      code: initialCode,
      props: propsConfig,
    },
  });
};
