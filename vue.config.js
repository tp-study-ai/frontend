const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  pwa: {
    name: 'Study AI',
    themeColor: '#f5f5f5',
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      maskIcon: null,
      msTileImage: null
    },
    assetsVersion: '1',

    manifestOptions: {
      icons: [
        {
          src: 'favicon.png',
          sizes: '16x16 24x24 32x32 64x64 192x192 512x512',
          type: 'image/png'
        }
      ],
      display: 'standalone'
    }
  }
});
