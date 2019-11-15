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
