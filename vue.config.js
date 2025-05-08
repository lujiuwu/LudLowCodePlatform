const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/LudLowCodePlatform/', // 替代 base
  outputDir: 'docs' // 替代 build.outDir
})
