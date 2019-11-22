import * as React from 'react';
import {addParameters, addDecorator, configure} from '@storybook/react';
import {Client as Styletron} from 'styletron-engine-atomic';
import {LightTheme, BaseProvider} from 'baseui';
import {Provider as StyletronProvider} from 'styletron-react';

const engine = new Styletron();

addParameters({
  options: {
    theme: {
      brandTitle: 'React View',
      brandUrl: 'https://github.com/uber/react-view',
    },
    showPanel: false,
  },
});

addDecorator(story => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>{story()}</BaseProvider>
  </StyletronProvider>
));

const loaderFn = () => [
  require('../examples/use-view.stories.tsx'),
  require('../examples/view.stories.tsx'),
  require('../examples/advanced.stories.tsx'),
];

configure(loaderFn, module);
