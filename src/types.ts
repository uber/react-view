/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as t from "@babel/types";
import { PluginItem } from "@babel/core";
import { PropTypes, Action } from "./const";
import lightTheme from "./light-theme";

export type TProvider<T = any> = {
  value: T;
  parse: (astRoot: any) => T;
  generate: (value: T, childTree: t.JSXElement) => t.JSXElement;
  imports: TImportsConfig;
};

export type TCustomProps = {
  [key: string]: {
    parse: (code: string, knobProps: any) => any;
    generate: (value: any) => any;
  };
};

export type TEditorLanguage =
  | "javascript"
  | "jsx"
  | "typescript"
  | "tsx"
  | "css";

export type TUseViewParams<CustomPropFields = any> = {
  componentName?: string;
  imports?: TImportsConfig;
  scope?: { [key: string]: any };
  props?: { [key: string]: TProp<CustomPropFields> };
  onUpdate?: (params: { code: string }) => void;
  initialCode?: string;
  provider?: TProvider;
  customProps?: TCustomProps;
};

export interface TViewParams extends TUseViewParams {
  className?: string;
}

export type TCompilerProps = {
  scope: { [key: string]: any };
  code: string;
  minHeight?: number;
  setError: (error: string | null) => void;
  transformations: ((ast: t.File) => t.File)[];
  placeholder?: React.FC<{ height: number }>;
  presets?: PluginItem[];
  className?: string;
};

export type TKnobsProps = {
  state: { [key: string]: TProp };
  set: (propValue: TPropValue, propName: string) => void;
  error: TError;
};

export type TEditorProps = {
  code: string;
  placeholder?: string;
  language?: TEditorLanguage;
  onChange: (code: string) => void;
  small?: boolean;
  theme?: typeof lightTheme;
  ["data-testid"]?: string;
  className?: string;
};

export type TErrorProps = {
  msg: string | null;
  code?: string;
  isPopup?: boolean;
  className?: string;
};

export type TUseView = <ProviderValue = any, CustomPropFields = any>(
  params?: TUseViewParams<CustomPropFields>,
) => {
  compilerProps: Omit<
    TCompilerProps,
    "minHeight" | "placeholder" | "presets" | "className"
  >;
  knobProps: TKnobsProps;
  editorProps: Omit<TEditorProps, "className">;
  errorProps: Omit<TErrorProps, "className">;
  providerValue: ProviderValue;
  actions: {
    formatCode: () => void;
    copyCode: () => void;
    copyUrl: () => void;
    reset: () => void;
    updateProvider: (value: ProviderValue) => void;
  };
};

export type TDispatch = (value: { type: Action; payload: any }) => void;

type TPropHookFn = (params: {
  getInstrumentOnChange: (what: string, into: string) => t.CallExpression;
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

export type TPropValue = undefined | boolean | string | number;

export type TProp<CustomPropFields = any> = {
  value: TPropValue;
  type: PropTypes;
  description: string;
  options?: any;
  placeholder?: string;
  defaultValue?: TPropValue;
  enumName?: string;
  hidden?: boolean;
  stateful?: boolean;
  propHook?: TPropHook;
  imports?: TImportsConfig;
  custom?: CustomPropFields;
};

export type TState<CustomPropFields = any> = {
  code: string;
  codeNoRecompile: string;
  props: {
    [key: string]: TProp<CustomPropFields>;
  };
  providerValue: any;
};
