import {TState} from './types';
import {Action} from './const';
import {assertUnreachable, buildPropsObj} from './utils';

export default function reducer(state: TState, action: {type: Action; payload: any}): TState {
  switch (action.type) {
    case Action.UpdateCode:
      return {...state, code: action.payload, codeNoRecompile: ''};
    case Action.UpdateCodeAndProvider:
      return {
        ...state,
        code: action.payload.code,
        providerValue: action.payload.providerValue,
        codeNoRecompile: '',
      };
    case Action.Update:
      return {
        ...state,
        code: action.payload.code,
        providerValue: action.payload.providerValue,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload.updatedPropValues),
      };
    case Action.UpdatePropsAndCodeNoRecompile:
      return {
        ...state,
        codeNoRecompile: action.payload.codeNoRecompile,
        props: buildPropsObj(state.props, action.payload.updatedPropValues),
      };
    case Action.UpdateProps:
      return {
        ...state,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload),
      };
    case Action.UpdatePropsAndCode:
      return {
        ...state,
        code: action.payload.code,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload.updatedPropValues),
      };
    case Action.Reset:
      return {
        ...state,
        code: action.payload.code,
        codeNoRecompile: '',
        props: action.payload.props,
      };
    default:
      return assertUnreachable();
  }
}
