import * as t from '@babel/types';
import {PropTypes, Action} from './const';

export type TProvider<T = any> = {
  value: T;
  parse: (astRoot: any) => T;
  generate: (value: T, childTree: t.JSXElement) => t.JSXElement;
  imports: TImportsConfig;
};

export type TUseView = (params: {
  componentName: string;
  imports: TImportsConfig;
  scope: {[key: string]: any};
  props: {[key: string]: TProp};
  onUpdate?: (params: {code: string}) => void;
  initialCode?: string;
  provider?: TProvider;
  customProps?: any;
  // customProps?: {
  //   [key: string]: {
  //     parse?: (attr: t.JSXAttribute) => TPropValue | null;
  //     generate?: (params: {value: TPropValue}) => any;
  //   };
  // };
}) => {
  compilerProps: any;
  knobProps: any;
  editorProps: any;
  errorProps: any;
  providerState: any;
  actions: any;
};

export type TDispatch = (value: {type: Action; payload: any}) => void;

type TPropHookFn = (params: {
  getYardOnChange: (what: string, into: string) => t.CallExpression;
  fnBodyAppend: (path: any, callExpression: t.CallExpression) => void;
}) => any;

export type TPropHook =
  | {
      what: string;
      into: string;
    }
  | TPropHookFn;

export type TImportsConfig = {
  [key: string]: {
    named?: string[];
    default?: string;
  };
};

export type TError = {
  where: string;
  msg: string | null;
};

export type TYardProps = {
  componentName: string;
  minHeight: number;
  scope: {[key: string]: any};
  props: {[key: string]: TProp};
  imports: TImportsConfig;
  mapTokensToProps?: {[key: string]: any};
};

export type TPropValue = undefined | boolean | string | number;

export type TProp = {
  value: TPropValue;
  type: PropTypes;
  description: string;
  options?: any;
  placeholder?: string;
  defaultValue?: TPropValue;
  enumName?: string;
  hidden?: boolean;
  names?: string[];
  sharedProps?: {[key: string]: string | {type: string; description: string}};
  stateful?: boolean;
  propHook?: TPropHook;
  imports?: TImportsConfig;
};

export type TState = {
  code: string;
  codeNoRecompile: string;
  props: {
    [key: string]: TProp;
  };
  providerValue: any;
};
