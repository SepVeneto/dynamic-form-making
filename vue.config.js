const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  publicPath: '/static/dynamicForm/', // 静态资源的公开路径
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(path.join(__dirname, 'src/icons')).end();
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}