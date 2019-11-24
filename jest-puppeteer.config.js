module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    defaultViewport: {
      width: 763,
      height: 1000,
    },
  },
};
