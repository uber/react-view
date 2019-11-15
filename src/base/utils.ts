import {TProp} from '../types';

export const countProps = (props: {[key: string]: TProp}, propsConfig: {[key: string]: TProp}) => {
  let changedProps = 0;
  Object.keys(props).forEach(prop => {
    if (
      prop !== 'overrides' &&
      props[prop].value !== '' &&
      typeof props[prop].value !== 'undefined' &&
      //@ts-ignore
      props[prop].value !== propsConfig[prop].value
    ) {
      changedProps++;
    }
  });
  return changedProps;
};

export type TPropValueOverrides = {
  [key: string]: {
    active: boolean;
    style: string;
  };
};

export const countOverrides = (overrides: any) => {
  const existingOverrides = overrides.value ? Object.keys(overrides.value) : [];
  return existingOverrides.filter(key => overrides.value[key].active).length;
};
