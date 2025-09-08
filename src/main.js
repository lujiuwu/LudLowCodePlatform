import { createApp } from 'vue'
import 'element-plus/theme-chalk/index.css'
import 'uno.css'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/Index.scss'
createApp(App).use(store).use(router).mount('#app')
