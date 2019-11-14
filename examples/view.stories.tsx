import * as React from 'react';
import ViewExample from './view';

export default {
  title: 'react-view hook',
};

export const toStorybook = () => {
  return <ViewExample />;
};

toStorybook.story = {
  name: 'View',
};
