## Contributing to React View

1. Clone the repo locally and run yarn to install dependencies from npm. We use [volta](https://volta.sh/).

```
git clone https://github.com/uber/react-view
cd react-view
yarn
```

2. You can test your changes inside of the storybook.

```
yarn storybook
```

3. When done, run all unit tests, e2e tests, typescript check and eslint via

```
yarn test:ci
```

All features and bug fixes should be covered by unit or e2e tests.
