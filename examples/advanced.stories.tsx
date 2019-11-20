import * as React from 'react';
import Theming from './theming';
import CustomProp from './custom-prop';

export default {
  title: 'Advanced',
};

export const customProp = () => {
  return <CustomProp />;
};

export const theming = () => {
  return <Theming />;
};
