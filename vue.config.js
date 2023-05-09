const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  pwa: {
    name: 'Study AI',
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      maskIcon: null,
      msTileImage: null
    },

    manifestOptions: {
      display: 'standalone'
    }
  }
});
