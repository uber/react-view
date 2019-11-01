import { addParameters, configure } from '@storybook/react'

addParameters({
  options: {
    name: 'React View',
    url: 'https://github.com/uber/react-view',
    showPanel: false,
  },
})

// automatically import all files ending in *.stories.tsx
configure(require.context('../examples', true, /\.stories\.tsx$/), module)
