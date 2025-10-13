<template>
    <div class="research-display">
         <div class="home-heard">

        <div class="home-heard-body">
            <div class="home-heard-body-title">
                <h1>让在线<span>学习、</span><span>考证</span>更简单</h1>
            </div>
        </div>    
        </div>
        <div class="container">
            <div class="header">
                <h1>考证分类</h1>
                <p>选择您需要的考证类型，开启学习之旅</p>
            </div>
            
            <div v-if="loading" class="loading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>
            
            <div v-else class="certificate-grid">
                <div 
                    v-for="cert in certificates" 
                    :key="cert._id"
                    class="certificate-card"
                    @click="navigateToPractise(cert._id)"
                >
                    <div class="card-icon">
                        <span class="icon">{{ getIcon(cert.typename) }}</span>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">{{ cert.typename }}</h3>
                        <p class="card-desc">{{ cert.introduce }}</p>
                        <div class="card-meta">
                            <span class="card-level">{{ cert.level }}</span>
                            <span class="card-count">{{ cert.quality }}+ 题目</span>
                        </div>
                        <div class="exam-info">
                            <span class="exam-questions">{{ cert.exam }}</span>
                        </div>
                    </div>
                    <div class="card-arrow">
                        <span>→</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/axios.ts'

interface Certificate {
    _id: string
    typename: string
    introduce: string
    level: string
    quality: string
    exam: string
    fullmarks: string
    passscore: string
    created_at: string
    id: number
}

const router = useRouter()
const certificates = ref<Certificate[]>([])
const loading = ref(true)

// 根据考证类型获取对应图标
const getIcon = (typename: string): string => {
    const iconMap: { [key: string]: string } = {
        '特种作业操作证（国家题库）': '⚡',
        '特种设备作业人员': '🔧',
        '安全生产管理人员': '🛡️',
        '主要负责人': '👔',
        '特种作业操作证（地区题库）': '',
        '建筑行业': '🏗️',
        '职业资格': '🎓',
        '特种作业操作证（四川复审）': '🔄',
        '煤矿类从业人员': '⛏️',
        '特种作业操作证（四川）': '🌶️',
        '注册类执业资格证': '📋',
        '道路运输（交通运输部）': '🚛',
        '燃气经营企业从业人员': '🔥',
        '油气田行业': '🛢️',
        '北京': '🏛️',
        '学历教育': '📚'
    }
    return iconMap[typename] || '📄'
}

// 获取考证数据
const fetchCertificates = async () => {
    try {
        loading.value = true
        const response = await request({
            url: '/certificate',
            method: 'get'
        })
        
        if (response && response.data) {
            console.log(response.data)
            certificates.value = response.data
        }
    } catch (error) {
        console.error('获取考证数据失败:', error)
        certificates.value = []
    } finally {
        loading.value = false
    }
}

// 导航到练习页面
const navigateToPractise = (_id: string) => {
    router.push({
        path: '/practise',
        query: { _id }
    })
}

// 组件挂载时获取数据
onMounted(() => {
    fetchCertificates()
})
</script>

<style scoped>

.home-heard {
        width: 100vw;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
    }
    .home-heard-body {
        padding-top: 50px;
    }

    .home-heard-body-title h1{
        margin: 0 auto;
        font-size: 28px;
        font-weight: 600;
        color: #333;
        text-align: center;
        line-height: 1.5;
        letter-spacing: 2px;
    }

    .home-heard-body-title span {
        color: #007bff;
    }


.research-display {

    min-height: 100vh;
    padding: 40px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    text-align: center;
    margin-bottom: 50px;
}

.header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.header p {
    font-size: 18px;
    color: #7f8c8d;
    margin: 0;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading p {
    color: #7f8c8d;
    font-size: 16px;
}

.certificate-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 40px;
}

.certificate-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
}

.certificate-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.certificate-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
}

.certificate-card:hover::before {
    transform: scaleX(1);
}

.card-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.icon {
    font-size: 18px;
    filter: grayscale(1) brightness(0) invert(1);
}

.card-content {
    flex: 1;
    min-width: 0;
}

.card-title {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 4px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-desc {
    font-size: 11px;
    color: #7f8c8d;
    margin: 0 0 8px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
    flex-wrap: wrap;
}

.card-level {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
}

.card-count {
    background: #ecf0f1;
    color: #7f8c8d;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
}

.exam-info {
    display: flex;
    gap: 6px;
    align-items: center;
}

.exam-questions {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
}

.card-arrow {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7f8c8d;
    font-size: 12px;
    transition: all 0.3s ease;
}

.certificate-card:hover .card-arrow {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(2px);
}

/* 响应式设计 - 确保所有屏幕都保持两列布局 */
@media (max-width: 768px) {
    .container {
        padding: 0 12px;
    }
    
    .header h1 {
        font-size: 24px;
    }
    
    .header p {
        font-size: 14px;
    }
    
    .certificate-grid {
        gap: 12px;
    }
    
    .certificate-card {
        padding: 12px;
        gap: 8px;
    }
    
    .card-icon {
        width: 32px;
        height: 32px;
    }
    
    .icon {
        font-size: 14px;
    }
    
    .card-title {
        font-size: 12px;
    }
    
    .card-desc {
        font-size: 10px;
    }
    
    .card-level,
    .card-count,
    .exam-questions {
        font-size: 9px;
        padding: 1px 4px;
    }
    
    .card-arrow {
        width: 20px;
        height: 20px;
        font-size: 10px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 8px;
    }
    
    .certificate-grid {
        gap: 8px;
    }
    
    .certificate-card {
        padding: 10px;
        gap: 6px;
    }
    
    .card-icon {
        width: 28px;
        height: 28px;
    }
    
    .icon {
        font-size: 12px;
    }
    
    .card-title {
        font-size: 11px;
    }
    
    .card-desc {
        font-size: 9px;
    }
    
    .card-meta {
        gap: 4px;
        margin-bottom: 4px;
    }
    
    .exam-info {
        gap: 4px;
    }
    
    .card-level,
    .card-count,
    .exam-questions {
        font-size: 8px;
        padding: 1px 3px;
    }
    
    .card-arrow {
        width: 18px;
        height: 18px;
        font-size: 9px;
    }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
    .certificate-card {
        padding: 8px;
        gap: 4px;
    }
    
    .card-icon {
        width: 24px;
        height: 24px;
    }
    
    .icon {
        font-size: 10px;
    }
    
    .card-title {
        font-size: 10px;
    }
    
    .card-desc {
        font-size: 8px;
    }
    
    .card-level,
    .card-count,
    .exam-questions {
        font-size: 7px;
        padding: 1px 2px;
    }
    
    .card-arrow {
        width: 16px;
        height: 16px;
        font-size: 8px;
    }
}
</style>
