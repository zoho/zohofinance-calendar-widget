let assetsDir = 'assets';
module.exports = {
  publicPath: '.',
  productionSourceMap: false,
  filenameHashing: false,
 assetsDir: assetsDir,
  
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
 
    svgRule.uses.clear();
 
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  devServer: {
    port: 8080, // CHANGE YOUR PORT HERE!
    https: true,
  },

}
