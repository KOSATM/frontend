const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 80,
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('~bootstrap', path.resolve(__dirname, 'node_modules/bootstrap'))
      .set('@', path.resolve(__dirname, 'src'))
  },
})
