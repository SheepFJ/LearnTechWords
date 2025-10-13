import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Introduce from '../components/About/Introduce.vue'
// 定义路由表
const routes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'   // 默认访问根目录重定向到登录页
    },
    {
        path: '/introduce',
        name: 'Introduce',
        component: Introduce
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 🔹 全局路由守卫：检查 token
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('user_token')

    if (to.path !== '/login' && !token) {
        // 如果访问的不是 /login 且没有 token → 强制跳转到登录页
        next('/login')
    } else {
        // 其它情况正常放行
        next()
    }
})

// 暴露路由
export default router
