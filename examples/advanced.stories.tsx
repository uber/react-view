import * as React from 'react';
import Theming from './theming';
import CustomKnob from './custom-knob';

export default {
  title: 'Advanced',
};

export const customKnob = () => {
  return <CustomKnob />;
};

export const theming = () => {
  return <Theming />;
};
