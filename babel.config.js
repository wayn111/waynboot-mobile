module.exports = {
  presets: ['@babel/preset-env'],
  // vant引入：https://youzan.github.io/vant/#/zh-CN/quickstart#yin-ru-zu-jian
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: name => `${name}/style/less`
      },
      'vant'
    ]
  ]
}
