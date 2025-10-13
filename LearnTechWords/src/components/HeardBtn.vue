<template>
    <header :class="{ 'header-hidden': isHeaderHidden, 'header-visible': !isHeaderHidden }" ref="headerRef">
        <div class="nav-container">
            <!-- 左侧网站名称 -->
            <div class="logo">
                
                <h1><img src="@/assets/img/logo.svg" alt="云上考证">云上考证</h1>
            </div>
            
            <!-- 中间导航菜单 -->
            <nav class="menu">
                <ul>


                    <li class="nav-item" 
                        @mouseenter="showDropdown('certificates')" 
                        @mouseleave="hideDropdown">
                        <a href="#" class="nav-link" @click.prevent="toggleDropdown('certificates')">学习<i class="iconfont icon-zhankai1"></i></a>
                        <div class="dropdown" 
                             :class="{ 'dropdown-show': activeDropdown === 'certificates' }"
                             @mouseenter="keepDropdown('certificates')"
                             @mouseleave="hideDropdown">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item">计算机等级</a>
                                <a href="#" class="dropdown-item">职业资格</a>
                                <a href="#" class="dropdown-item">技能认证</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item" 
                        @mouseenter="showDropdown('tools')" 
                        @mouseleave="hideDropdown">
                        <a href="#" class="nav-link" @click.prevent="toggleDropdown('tools')">资料<i class="iconfont icon-zhankai1"></i></a>
                        <div class="dropdown" 
                             :class="{ 'dropdown-show': activeDropdown === 'tools' }"
                             @mouseenter="keepDropdown('tools')"
                             @mouseleave="hideDropdown">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item">答题工具</a>
                                <a href="#" class="dropdown-item">学习工具</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item" 
                        @mouseenter="showDropdown('courses')" 
                        @mouseleave="hideDropdown">
                        <a href="#" class="nav-link" @click.prevent="toggleDropdown('courses')">关于<i class="iconfont icon-zhankai1"></i></a>
                        <div class="dropdown" 
                             :class="{ 'dropdown-show': activeDropdown === 'courses' }"
                             @mouseenter="keepDropdown('courses')"
                             @mouseleave="hideDropdown">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item" @click="router.push('/introduce')">项目介绍</a>
                                <a href="#" class="dropdown-item">关于我们</a>
                                <a href="#" class="dropdown-item">联系我们</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            
            <!-- 右侧登录/用户信息按钮 -->
            <div class="user-section" @mouseleave="showUserMenu = false">
                <template v-if="!userInfo">
                    <button class="login-btn" @click="handleLogin">
                        登录
                    </button>
                </template>
                <template v-else>
                    <div class="user-info-wrapper" style="position: relative; display: inline-block;">
                        <span 
                            class="user-name" 
                            @mouseenter="showUserMenu = true"
                            style="cursor: pointer;"
                        >
                            {{ userInfo.name || userInfo.username || '用户' }}
                        </span>
                        <div 
                            class="user-dropdown-menu" 
                            v-show="showUserMenu"
                            @mouseenter="showUserMenu = true"
                            @mouseleave="showUserMenu = false"
                            style="position: absolute; right: 0; top: 100%; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; min-width: 120px; z-index: 100;"
                        >
                            <!-- <a 
                                href="#" 
                                class="dropdown-item" 
                                style="display: block; padding: 10px 20px; color: #333; text-decoration: none;"
                                @click.prevent="goToMyWrongQuestions"
                            >我的错题</a> -->
                            <a 
                                href="#" 
                                class="dropdown-item" 
                                style="display: block; padding: 10px 20px; color: #e74c3c; text-decoration: none;"
                                @click.prevent="handleLogout"
                            >登出</a>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CeShi from '@/components/CeShi.vue'
// 响应式数据
const isHeaderHidden = ref(false)
const activeDropdown = ref('')
const lastScrollY = ref(0)
const headerRef = ref<HTMLElement | null>(null)

// 用户信息与菜单显示
const userInfo = ref<any | null>(null)
const showUserMenu = ref(false)

// 初始化用户信息
const loadUserInfo = () => {
    const info = localStorage.getItem('user_info')
    if (info) {
        try {
            userInfo.value = JSON.parse(info)
        } catch {
            userInfo.value = null
        }
    } else {
        userInfo.value = null
    }
}

// 监听本地存储变化（如多标签页同步退出）
window.addEventListener('storage', (e) => {
    if (e.key === 'user_info' || e.key === 'user_token') {
        loadUserInfo()
    }
})

// 页面加载时获取用户信息
onMounted(() => {
    loadUserInfo()
})

// // 登录处理


// 退出登录
const handleLogout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    userInfo.value = null
    showUserMenu.value = false
    router.push('/login')
}

// 跳转到我的错题
const goToMyWrongQuestions = () => {
    // 这里可以根据实际路由调整
    router.push('/my-wrong-questions')
}

// 滚动处理函数
const handleScroll = () => {
    const currentScrollY = window.scrollY
    
    // 在顶部时始终显示
    if (currentScrollY <= 10) {
        isHeaderHidden.value = false
    } else {
        // 向下滚动隐藏，向上滚动显示
        if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
            isHeaderHidden.value = true
        } else {
            isHeaderHidden.value = false
        }
    }
    
    lastScrollY.value = currentScrollY
}

// 下拉菜单控制
const showDropdown = (dropdownName: string) => {
    activeDropdown.value = dropdownName
}

const keepDropdown = (dropdownName: string) => {
    // 当鼠标移动到下拉菜单内容时，保持显示
    activeDropdown.value = dropdownName
}

const hideDropdown = () => {
    // 当鼠标移出整个导航项区域时，立即隐藏
    activeDropdown.value = ''
}

const toggleDropdown = (dropdownName: string) => {
    activeDropdown.value = activeDropdown.value === dropdownName ? '' : dropdownName
}

const handleDocumentClick = (event: MouseEvent) => {
    const targetNode = event.target as Node | null
    if (headerRef.value && targetNode && !headerRef.value.contains(targetNode)) {
        activeDropdown.value = ''
    }
}

// 登录处理
const handleLogin = () => {
    router.push('/login')
}

// 生命周期钩子
onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleDocumentClick, true)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleDocumentClick, true)
})
</script>

<style scoped>
/* 基础样式 */
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-hidden {
    transform: translateY(-100%);
}

.header-visible {
    transform: translateY(0);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 70px;
}

/* Logo 样式 */
.logo h1 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    /* 保证图片和文字居中对齐 */
    gap: 4px;
}

.logo h1:hover {
    transform: scale(1.05);
}


.iconfont {
    font-size: 12px;
    vertical-align: middle;
}

.logo img {
    width: 35px;
    height: 35px;
    /* 移除 margin-right，使用 flex gap 控制间距 */
    display: inline-block;
    vertical-align: middle;
}

/* 导航菜单样式 */
.menu ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
}

.nav-item {
    position: relative;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: color 0.3s ease;
    position: relative;
    display: block;
}

/* 底部横线效果 */
.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
}

.nav-link:hover::after {
    width: 100%;
}

.nav-link:hover {
    color: #667eea;
}

/* 下拉菜单样式 */
.dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top center;
    z-index: 1001;
}

.dropdown-show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

.dropdown-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 1rem 0;
    margin-top: 0.5rem;
    min-width: 180px;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: #555;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
}

.dropdown-item:hover {
    background: rgba(102, 126, 234, 0.05);
    color: #667eea;
    border-left-color: #667eea;
    transform: translateX(5px);
}

/* 用户登录区域 */
.user-section {
    display: flex;
    align-items: center;
}

.login-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
    transform: translateY(0);
}

.user-icon {
    font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .nav-container {
        padding: 0 1.25rem;
        height: 64px;
    }

    .logo h1 {
        font-size: 1.6rem;
    }

    .menu ul {
        gap: 1.25rem;
    }

    .nav-link {
        font-size: 0.95rem;
        padding: 0.45rem 0.85rem;
    }
}

@media (max-width: 768px) {
    .nav-container {
        padding: 0 0.5rem;
        height: 60px;
    }
    
    .logo h1 {
        font-size: 1.2rem;
    }
    .logo img {
        width: 25px;
        height: 25px;
    }
    

    .menu ul {
        gap: 0.75rem;
    }

    .nav-link {
        font-size: 0.85rem;
        padding: 0.4rem 0.65rem;
    }
    
    .login-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .logo h1 {
        font-size: 1.25rem;
    }

    .menu ul {
        gap: 0.5rem;
    }

    .nav-link {
        font-size: 0.8rem;
        padding: 0.35rem 0.5rem;
    }

    .dropdown-content {
        min-width: 150px;
    }
}

/* 添加一些动画效果 */
@keyframes slideInFromTop {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.header-visible {
    animation: slideInFromTop 0.3s ease-out;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>