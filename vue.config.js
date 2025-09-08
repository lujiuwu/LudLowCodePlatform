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
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
            maxSize: 244000
          },
          elementPlus: {
            name: 'chunk-element-plus',
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            priority: 20,
            chunks: 'all',
            maxSize: 244000
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
            maxSize: 244000
          }
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].template = require.resolve('./public/index.html')
      return args
    })
    // 添加代码分割优化
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    })
  }
})
