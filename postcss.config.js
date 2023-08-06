module.exports = {
  plugins: {
    // https://github.com/csstools/postcss-preset-env
    'postcss-preset-env': {},
    // https://github.com/wswmsword/postcss-mobile-forever
    'postcss-mobile-forever': {
      viewportWidth: file => /vant[\\/]/.test(file) ? 375 : 750,
      maxDisplayWidth: 560,
      unitPrecision: 3,
      propList: ['*'],
      selectorBlackList: ['.ignore'],
      rootContainingBlockSelectorList: ['van-popup--bottom'],
      disableLandscape: true,
      disableDesktop: true
    }
  }
}
