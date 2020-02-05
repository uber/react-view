import * as React from 'react';
import {addParameters, configure} from '@storybook/react';

addParameters({
  options: {
    theme: {
      brandTitle: 'React View',
      brandUrl: 'https://github.com/uber/react-view',
    },
    showPanel: false,
  },
});

const loaderFn = () => [
  require('../examples/use-view.stories.tsx'),
  require('../examples/view.stories.tsx'),
  require('../examples/advanced.stories.tsx'),
  require('../examples/test.stories.tsx'),
];

configure(loaderFn, module);
