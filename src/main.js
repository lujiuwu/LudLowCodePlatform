import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'uno.css'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/index.scss'
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
