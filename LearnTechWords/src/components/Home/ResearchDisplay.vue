<template>
    <div class="research-display">
        <!-- 滚动展示头部 -->
        <div class="scroll-header">
            <div class="scroll-container">
                <div class="scroll-item" v-for="(item, index) in scrollItems" :key="index" :class="{ active: currentIndex === index }">
                    <div class="content-wrapper">
                        <div class="text-section">
                            <h2>{{ item.title }}</h2>
                            <p>{{ item.description }}</p>
                        </div>
                        <div class="image-section">
                            <img :src="item.image" :alt="item.title" />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 指示器 -->
            <div class="indicators">
                <span 
                    v-for="(item, index) in scrollItems" 
                    :key="index"
                    :class="{ active: currentIndex === index }"
                    @click="goToSlide(index)"
                ></span>
            </div>
        </div>

        <!-- 立即开始学习 -->
        <div class="start-learning">
            <button @click="router.push('/study')">立即开始学习>></button>
        </div>

        
    </div>
    <ChaoXingTranslate />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ChaoXingTranslate from '@/components/Home/ChaoXingTranslate.vue'

const router = useRouter()
const currentIndex = ref(0)

// 滚动展示数据 - 可扩展的结构
const scrollItems = ref([
    {
        title: '例句辅助记忆',
        description: '例句辅助记忆，马上开启学习之旅！',
        image: '/src/assets/home/liju.png'
    },
    {
        title: 'AI拆分单词',
        description: 'AI拆分单词，记忆更高效！',
        image: '/src/assets/home/aibot.png'
    }
    
    // 可以在这里添加更多展示项
])

let autoScrollTimer = null

// 自动滚动
const startAutoScroll = () => {
    autoScrollTimer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % scrollItems.value.length
    }, 10000) // 每10秒切换一次
}

// 停止自动滚动
const stopAutoScroll = () => {
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer)
        autoScrollTimer = null
    }
}

// 跳转到指定幻灯片
const goToSlide = (index) => {
    currentIndex.value = index
    stopAutoScroll()
    startAutoScroll()
}

// 组件挂载时开始自动滚动
onMounted(() => {
    startAutoScroll()
})

// 组件卸载时清理定时器
onUnmounted(() => {
    stopAutoScroll()
})
</script>

<style scoped>
.research-display {
    min-height: 100vh;
    padding: 0;
    border-bottom: 2px dashed #b1b1b1;
}

/* 滚动展示头部 */
.scroll-header {
    position: relative;
    height: 80vh;
    overflow: hidden;
    /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
}

.scroll-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.scroll-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.scroll-item.active {
    opacity: 1;
    transform: translateX(0);
}

.content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    width: 100%;
    padding: 0 40px;
    gap: 60px;
}

.text-section {
    flex: 1;
    text-align: left;
}

.text-section h2 {
    font-size: 48px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 20px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.text-section p {
    font-size: 24px;
    color: #7f8c8d;
    margin: 0;
    line-height: 1.6;
    font-weight: 500;
}

.image-section {
    flex: 1;
    /* margin-left: -300px; */
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-section img {
    max-width: 105%;
    max-height: 500px;
    object-fit: contain;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.image-section img:hover {
    transform: scale(1.05);
}

/* 指示器 */
.indicators {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
}

.indicators span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
}

.indicators span.active {
    background: #667eea;
    transform: scale(1.2);
}

.indicators span:hover {
    background: rgba(102, 126, 234, 0.7);
}

/* 立即开始学习按钮 */
.start-learning {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.start-learning button {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 28px;
    padding: 14px 40px;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(118, 75, 162, 0.3);
    transition: all 0.3s ease;
    letter-spacing: 1.2px;
    outline: none;
}

.start-learning button:hover {
    background: linear-gradient(100deg, #5a67d8 0%, #7f53ac 100%);
    transform: translateY(-2px) scale(1.025);
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
        padding: 0 20px;
        gap: 40px;
        text-align: center;
    }
    
    .text-section {
        text-align: center;
        /* margin-left: 0px; */
    }
    
    .text-section h2 {
        font-size: 32px;
    }
    
    .text-section p {
        font-size: 18px;
    }
    
    .image-section img {
        max-height: 300px;
        
    }
    
    .start-learning {
        bottom: 80px;
    }
    
    .start-learning button {
        font-size: 16px;
        padding: 12px 30px;
    }
}

@media (max-width: 480px) {
    .content-wrapper {
        padding: 0 15px;
        gap: 30px;
    }
    
    .text-section h2 {
        font-size: 24px;
    }
    
    .text-section p {
        font-size: 16px;
    }
    
    .image-section img {
        max-height: 250px;
    }
    
    .indicators {
        bottom: 30px;
    }
    
    .start-learning {
        bottom: 60px;
    }
    
    .start-learning button {
        font-size: 14px;
        padding: 10px 25px;
    }
}
</style>
