module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  });
  config['node'] = { fs: 'empty' };
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
