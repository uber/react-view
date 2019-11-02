import * as React from 'react'
import { Button } from 'baseui/button'

export default {
  title: 'react-view',
}

//const haha: boolean = true

export const toStorybook = () => (
  <div>
    <Button onClick={() => alert('click')}>Hello</Button>
  </div>
)

toStorybook.story = {
  name: 'Basic',
}
