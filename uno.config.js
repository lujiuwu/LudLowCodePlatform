import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 默认预设，包含Tailwind CSS兼容的工具类
    presetAttributify(), // 属性化模式支持
    presetIcons() // 图标支持
  ],
  content: {
    filesystem: ['./src/*.{html,js,ts,jsx,tsx,vue}']
  }
})
