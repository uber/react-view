## Contributing to React View

1. Clone the repo locally and run yarn to install dependencies from npm. We use [volta](https://volta.sh/).

```sh
git clone https://github.com/uber/react-view
cd react-view
pnpm install
```

2. You can test your changes inside of the Ladle dev server by running:

```sh
pnpm ladle serve
```

3. When done, run all unit tests, e2e tests, typescript check and eslint via:

```sh
pnpm typecheck
pnpm lint
pnpm test
```

All features and bug fixes should be covered by unit or e2e tests.
