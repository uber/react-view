/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
export enum Action {
  Update,
  UpdateCode,
  UpdateCodeAndProvider,
  UpdatePropsAndCodeNoRecompile,
  UpdatePropsAndCode,
  UpdateProps,
  Reset,
}

export enum PropTypes {
  String = 'string',
  ReactNode = 'react node',
  Boolean = 'boolean',
  Number = 'number',
  Enum = 'enum',
  Array = 'array',
  Object = 'object',
  Function = 'function',
  Ref = 'ref',
  Date = 'date',
  Custom = 'custom',
}
