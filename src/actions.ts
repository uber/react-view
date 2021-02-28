/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {parseCode} from './ast';
import {Action, PropTypes} from './const';
import {TProp, TDispatch, TPropValue, TCustomProps} from './types';

export const updateCode = (dispatch: TDispatch, newCode: string) => {
  dispatch({
    type: Action.UpdateCode,
    payload: newCode,
  });
};

export const updateCodeAndProvider = (
  dispatch: TDispatch,
  newCode: string,
  providerValue: any
) => {
  dispatch({
    type: Action.UpdateCodeAndProvider,
    payload: {
      code: newCode,
      providerValue,
    },
  });
};

export const updateAll = (
  dispatch: TDispatch,
  newCode: string,
  componentName: string,
  propsConfig: {[key: string]: TProp},
  parseProvider?: (astRoot: any) => any,
  customProps?: TCustomProps
) => {
  const propValues: {[key: string]: TPropValue} = {};
  const {parsedProps, parsedProvider} = parseCode(
    newCode,
    componentName,
    parseProvider
  );
  Object.keys(propsConfig).forEach((name) => {
    propValues[name] = propsConfig[name].value;
    if (customProps && customProps[name] && customProps[name].parse) {
      // custom prop parser
      propValues[name] = customProps[name].parse(
        parsedProps[name],
        propsConfig
      );
    } else if (propsConfig[name].type === PropTypes.Date) {
      const match = parsedProps[name].match(
        /^new\s*Date\(\s*"([0-9-T:.Z]+)"\s*\)$/
      );
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
      providerValue: parsedProvider,
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

export const updateProps = (
  dispatch: TDispatch,
  propName: string,
  propValue: TPropValue
) => {
  dispatch({
    type: Action.UpdateProps,
    payload: {[propName]: propValue},
  });
};

export const reset = (
  dispatch: TDispatch,
  initialCode: string,
  providerValue: any,
  propsConfig: {[key: string]: TProp}
) => {
  dispatch({
    type: Action.Reset,
    payload: {
      code: initialCode,
      props: propsConfig,
      providerValue,
    },
  });
};
