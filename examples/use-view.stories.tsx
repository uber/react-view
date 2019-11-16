import * as React from 'react';
import FullExample from './full-example';
import BasewebExample from './baseweb-example';
import LiveCodeOnly from './live-code-only';

export default {
  title: 'useView',
};

export const fullExample = () => {
  return <FullExample />;
};

export const basewebExample = () => {
  return <BasewebExample />;
};

export const liveCodeOnly = () => {
  return <LiveCodeOnly />;
};
