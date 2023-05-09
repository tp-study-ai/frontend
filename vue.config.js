const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  pwa: {
    name: 'Study AI',
    themeColor: '#f5f5f5',
    iconPaths: {
      favicon32: 'img/icons/favicon.png',
      favicon16: 'img/icons/favicon.png',
      appleTouchIcon: 'img/icons/favicon.png',
      maskIcon: null,
      msTileImage: null
    },

    manifestOptions: {
      icons: [
        {
          src: 'img/icons/favicon.png',
          sizes: '16x16 24x24 32x32 64x64 192x192 512x512',
          type: 'image/png'
        }
      ],
      display: 'standalone'
    }
  }
});
