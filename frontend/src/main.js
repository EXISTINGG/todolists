import { createApp } from 'vue'
import './style.css'
import 'element-plus/theme-chalk/src/message.scss'
import App from './App.vue'
import router from './router/index.js'
// 导入pinia
import {createPinia} from 'pinia'
// 创建pinia实例
const pinia = createPinia()


createApp(App).use(router).use(pinia).mount('#app')
