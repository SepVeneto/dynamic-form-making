// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

function parseExternals(config) {
  return config.reduce((ext, curr) => {
    ext[curr.name] = curr.scope;
    return ext;
  }, {})
}

const cdnConfig = process.env.NODE_ENV === 'production' ? [
  {
    name: 'vue',
    scope: 'Vue',
    js: 'https://cdn.jsdelivr.net/npm/vue@2.6.14',
  },
  {
    name: 'element-ui',
    scope: 'ELEMENT',
    js: 'https://cdn.jsdelivr.net/npm/element-ui@2.15.3/lib/index.js',
    css: 'https://cdn.jsdelivr.net/npm/elementgui@2.15.3/lib/theme-chalk/index.css'
  }
] : [];

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/dynamic-form-making/' : '', // 静态资源的公开路径
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = 'dynamic-form-making';
      args[0].cdnConfig = cdnConfig;
      return args;
    })
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
    externals: parseExternals(cdnConfig),
    // plugins: [
    //   new BundleAnalyzerPlugin()
    // ]
  }
}