const { defineConfig } = require('@vue/cli-service')
const UnoCSS = require('@unocss/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/LudLowCodePlatform/', // 替代 base
  outputDir: 'docs', // 替代 build.outDir
  parallel: false, // 禁用 thread-loader 以避免循环引用问题
  configureWebpack: {
    plugins: [
      UnoCSS()
    ]
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].template = require.resolve('./public/index.html')
      return args
    })
  }
})
