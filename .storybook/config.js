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

// automatically import all files ending in *.stories.tsx
configure(require.context('../examples', true, /\.stories\.tsx$/), module);
