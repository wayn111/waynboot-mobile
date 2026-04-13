module.exports = {
  plugins: {
    // https://github.com/csstools/postcss-preset-env
    'postcss-preset-env': {},
    'postcss-pxtorem': {
      rootValue({ file }) {
        return file && file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      selectorBlackList: ['.ignore'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 1,
    }
  }
}
