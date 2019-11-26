<p align="center"><img src="https://user-images.githubusercontent.com/1387913/69589804-18001a80-0fa2-11ea-9af7-106ccaa5ab2b.png" width="50%"><p>

**React View is an interactive playground, documentation and code generator for your components.** Use it to document your component API, let users to live-edit the props and grab the generated ready-to-use source code.

<p align="center"><img src="https://user-images.githubusercontent.com/1387913/69589789-09196800-0fa2-11ea-9485-aeb506d18fe8.gif" width="75%"><p>

**There are three main ways** how to use React View:

- **All-in-one playground**. Import `<View />`, give it the component configuration and drop it in your web documentation. Done. This is ideal if you want to start as quick as possible and don't need to customize anything.
- **Build your own playground**. Import the `useView` hook and give it the component configuration. This hook handles the playground state and returns various props and callbacks that you can fit into your own UI components. React View also exports all default UI parts separately (`Editor`, `ActionButtons`, `Compiler`, `Knobs`, `Error`...) so you can reuse them. This is a great option if you want to customize some parts of the default UI (or all of it) and not to worry about the rest.
- **Live code editing only**. Sometimes it is useful to only have an editable source code and live preview without the list of props. You can use `useView` for that too. Just don't give it any component configuration and don't render the `<Knobs />` component. React View uses babel, so **you can add aditional presets and enable TypeScript**.

## Installation

```sh
yarn add react-view
```

## All-in-one Playground Example

```tsx
import {View, PropTypes} from 'react-view';
import {Button} from 'your-button-component';

export default () => (
  <View
    componentName="Button"
    props={{
      children: {
        value: 'Hello',
        type: PropTypes.ReactNode,
        description: 'Visible label.',
      },
      onClick: {
        value: '() => alert("click")',
        type: PropTypes.Function,
        description: 'Function called when button is clicked.',
      },
      disabled: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Indicates that the button is disabled',
      },
    }}
    scope={{
      Button,
    }}
    imports={{
      'your-button-component': {
        named: ['Button'],
      },
    }}
  />
);
```

This is a basic example demonstrating the all-in-one `View` component. You need to define the component name, props, scope and imports. This example renders the gif above (without the `size` prop).

## Build Your Own Playground

The View component is a tiny wrapper around the `useView` hook. If you wish to do some customization and have more control, you can opt-in for this more flexible API:

```tsx
import * as React from 'react';
import {Button} from 'your-button-component';

import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
  PropTypes,
} from 'react-view';

export default () => {
  const params = useView({
    componentName: 'Button',
    props: {
      children: {
        value: 'Hello',
        type: PropTypes.ReactNode,
        description: 'Visible label.',
      },
      onClick: {
        value: '() => alert("click")',
        type: PropTypes.Function,
        description: 'Function called when button is clicked.',
      },
      disabled: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Indicates that the button is disabled',
      },
    },
    scope: {
      Button,
    },
    imports: {
      'your-button-component': {
        named: ['Button'],
      },
    },
  });

  return (
    <React.Fragment>
      <Compiler
        {...params.compilerProps}
        minHeight={62}
        placeholder={Placeholder}
      />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </React.Fragment>
  );
};
```

## Live Code Editing Only

<p align="center"><img src="https://user-images.githubusercontent.com/1387913/69591933-3289c200-0fa9-11ea-952b-d628ace46e8a.gif" width="75%"><p>

If you don't need the code generation or props documentation, you can also use React View as an editable source code with the live preview.

```tsx
import {useView, Compiler, Editor, Error} from 'react-view';
import presetTypescript from '@babel/preset-typescript';

export default () => {
  const params = useView({
    initialCode: `() => {
      const text: string = "Hey";
      return <h2>{text}</h2>;
    }`,
    scope: {},
    onUpdate: console.log,
  });

  return (
    <React.Fragment>
      <Compiler {...params.compilerProps} presets={[presetTypescript]} />
      <Editor {...params.editorProps} language="tsx" />
      <Error {...params.errorProps} />
    </React.Fragment>
  );
};
```

This example also demonstrates how to opt-in into TypeScript support. Since the babel is our compiler, you can simply add aditional presets (`preset-react` is applied by default). If you are using additional components or dependencies, you need to pass them through `scope`.

You could also pass just a naked JSX element:

```tsx
<h2>Hey</h2>
```

or pretty much anything that could be executed after the return statement of JS function:

```js
2 + 5;
```

## Prior Art & Similar Projects

[React Live](https://github.com/FormidableLabs/react-live). The first prototype of React View was even using react-live but eventually we needed a finer-grained control over the compilation proces and more flexible API. We also rely on babel and babel-parser instead of buble.

[Storybook knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs). They allow you to edit component props dynamically using the Storybook UI. We use the same concept.

[Playroom](https://github.com/seek-oss/playroom). Simultaneously design across a variety of themes and screen sizes, powered by JSX and your own component library.
