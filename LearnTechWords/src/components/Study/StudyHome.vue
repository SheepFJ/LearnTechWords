<template>
  <HeardBtn />
  <div class="study-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载学习数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else-if="studyData" class="study-content">
      <!-- 头部欢迎区域 -->
      <div class="welcome-section">
        <h1>学习中心</h1>
        <p>继续您的学习之旅，每天进步一点点</p>
      </div>

      <!-- 学习进度概览 -->
      <div class="progress-overview">
        <div class="progress-card main-progress">
          <div class="progress-header">
            <h3>学习进度</h3>
            <span class="progress-date">{{ formatDate(studyData.today_data) }}</span>
          </div>
          <div class="progress-stats">
            <div class="stat-item">
              <div class="stat-number">{{ studyData.total_words }}</div>
              <div class="stat-label">词库总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ studyData.learned_count }}</div>
              <div class="stat-label">已学习</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ studyData.mastered_count }}</div>
              <div class="stat-label">已掌握</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ studyData.learned_today }}</div>
              <div class="stat-label">今日学习</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-number">{{ studyData.daily_goal }}</div>
              <div class="stat-label">今日目标</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ masteryRate.toFixed(1) }}%</div>
              <div class="stat-label">掌握率</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ studyData.learned_count > 0 ? '1' : '0' }}</div>
              <div class="stat-label">学习天数</div>
            </div>
            
            
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (studyData.learned_today / studyData.daily_goal) * 100 + '%' }"></div>
          </div>
          <div class="progress-text">
            今日进度: {{ studyData.learned_today }}/{{ studyData.daily_goal }} 
            ({{ (studyData.learned_today / studyData.daily_goal) * 100 }}%)
          </div>
        </div>
      </div>

      <!-- 学习操作区域 -->
      <div class="action-section">
        <div class="action-cards">
          <div class="action-card primary">
            <div class="action-icon">🚀</div>
            <div class="action-content">
              <h4>开始学习</h4>
              <p>继续学习新单词</p>
            </div>
            <button class="action-btn primary-btn" @click="router.push('/toStudy')">开始</button>
          </div>
          
          <div class="action-card secondary">
            <div class="action-icon">🔄</div>
            <div class="action-content">
              <h4>复习巩固</h4>
              <p>复习已学过的单词</p>
            </div>
            <button class="action-btn secondary-btn">复习</button>
          </div>
          
          <div class="action-card tertiary">
            <div class="action-icon">⚙️</div>
            <div class="action-content">
              <h4>调整目标</h4>
              <p>修改每日学习目标</p>
            </div>
            <button class="action-btn tertiary-btn" @click="showTargetModal">设置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标设置弹窗 -->
    <MyTarget 
      :visible="showTargetModalFlag" 
      @close="showTargetModalFlag = false"
      @success="handleTargetSet"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { myhost } from '@/types/myhost'
import MyTarget from './MyTarget.vue'
import HeardBtn from '@/components/HeardBtn.vue'
import { useRouter } from 'vue-router'

// 响应式数据
const isLoading = ref(true)
const studyData = ref<any>(null)
const showTargetModalFlag = ref(false)
const router = useRouter()
// 计算属性
const progressPercentage = computed(() => {
  if (!studyData.value) return 0
  return (studyData.value.learned_count / studyData.value.daily_goal) * 100
})

const masteryRate = computed(() => {
  if (!studyData.value || studyData.value.total_words === 0) return 0
  return (studyData.value.mastered_count / studyData.value.total_words) * 100
})

const learningRate = computed(() => {
  if (!studyData.value || studyData.value.total_words === 0) return 0
  return (studyData.value.learned_count / studyData.value.total_words) * 100
})

// 初始化学习数据
const initializeStudy = async () => {
  try {
    isLoading.value = true
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    
    const response = await axios.post(`${myhost.api}/study`, {
      user_info: userInfo
    })
    
    if (response.data.message === 'OK') {
      // 用户已存在，直接显示数据
      studyData.value = response.data
    } else if (response.data.message === 'NO') {
      // 用户不存在，显示目标设置弹窗
      showTargetModalFlag.value = true
    }
  } catch (error) {
    console.error('初始化学习数据失败:', error)
    alert('加载失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 处理目标设置成功
const handleTargetSet = (data: any) => {
  studyData.value = data
  showTargetModalFlag.value = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 显示目标设置弹窗
const showTargetModal = () => {
  showTargetModalFlag.value = true
}

// 组件挂载时初始化
onMounted(() => {
  initializeStudy()
})
</script>

<style scoped>
.study-container {
  
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  padding: 20px;
  margin-top: 50px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.study-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
}

.welcome-section h1 {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section p {
  font-size: 18px;
  color: #6c757d;
  margin: 0;
}

.progress-overview {
  margin-bottom: 40px;
}

.progress-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.progress-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.progress-date {
  font-size: 14px;
  color: #6c757d;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 16px;
  color: #495057;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
}

.action-section {
  margin-bottom: 40px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.action-card.primary .action-icon {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.action-card.secondary .action-icon {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.action-card.tertiary .action-icon {
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
}

.action-content {
  flex: 1;
}

.action-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.action-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.secondary-btn {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
}

.tertiary-btn {
  background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .study-container {
    padding: 10px;
  }
  
  .welcome-section {
    padding: 20px 10px;
  }
  
  .welcome-section h1 {
    font-size: 28px;
  }
  
  .progress-card {
    padding: 20px;
  }
  

  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .progress-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>