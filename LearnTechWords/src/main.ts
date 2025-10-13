
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios'  // 引入 axios 配置，确保拦截器生效

// 动态设置可见高度
// function setAppHeight() {
//     document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
// }
// window.addEventListener('resize', setAppHeight)
// setAppHeight()


const app = createApp(App)
app.use(router)
app.mount('#app')
