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
      icons: [
        {
          src: 'favicon.png',
          sizes: '16x16 24x24 32x32 64x64',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      display: 'standalone'
    }
  }
});
