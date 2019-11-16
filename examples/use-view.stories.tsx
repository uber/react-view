import * as React from 'react';
import Basic from './basic';
import StateHook from './state-hook';
import Baseweb from './baseweb';
import LiveCodeOnly from './live-code-only';

export default {
  title: 'useView',
};

export const basic = () => {
  return <Basic />;
};

export const stateHook = () => {
  return <StateHook />;
};

export const baseweb = () => {
  return <Baseweb />;
};

export const liveCodeOnly = () => {
  return <LiveCodeOnly />;
};
