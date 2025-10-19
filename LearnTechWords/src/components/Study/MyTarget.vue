<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>设置学习目标</h2>
        <p>选择您每日想要学习的单词数量</p>
      </div>
      
      <div class="modal-body">
        <div class="goal-options">
          <div 
            v-for="goal in goalOptions" 
            :key="goal.value"
            :class="['goal-option', { active: selectedGoal === goal.value }]"
            @click="selectGoal(goal.value)"
          >
            <div class="goal-number">{{ goal.value }}</div>
            <div class="goal-label">{{ goal.label }}</div>
            <div class="goal-desc">{{ goal.description }}</div>
          </div>
        </div>
        
        <div class="custom-goal">
          <label for="custom-goal">或自定义目标：</label>
          <input
            id="custom-goal"
            v-model.number="customGoal"
            type="number"
            min="1"
            max="100"
            placeholder="输入1-100之间的数字"
            class="custom-input"
            @input="handleCustomInput"
          />
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          @click="confirmGoal" 
          class="confirm-btn"
          :disabled="!selectedGoal || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '设置中...' : '确认目标' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { myhost } from '@/types/myhost'

// Props
interface Props {
  visible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  success: [data: any]
}>()

// 响应式数据
const isVisible = ref(props.visible)
const selectedGoal = ref<number | null>(null)
const customGoal = ref<number | null>(null)
const isLoading = ref(false)

// 预设目标选项
const goalOptions = [
  { value: 10, label: '轻松模式', description: '适合初学者' },
  { value: 20, label: '标准模式', description: '推荐选择' },
  { value: 30, label: '挑战模式', description: '适合进阶' },
  { value: 50, label: '学霸模式', description: '高强度学习' }
]

// 监听visible变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    // 重置状态
    selectedGoal.value = null
    customGoal.value = null
  }
})

// 选择预设目标
const selectGoal = (goal: number) => {
  selectedGoal.value = goal
  customGoal.value = null
}

// 处理自定义输入
const handleCustomInput = () => {
  if (customGoal.value && customGoal.value >= 1 && customGoal.value <= 100) {
    selectedGoal.value = customGoal.value
  } else {
    selectedGoal.value = null
  }
}

// 确认目标
const confirmGoal = async () => {
  if (!selectedGoal.value) return
  
  isLoading.value = true
  
  try {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    
    const response = await axios.post(`${myhost.api}/study`, {
      user_info: userInfo,
      daily_goal: selectedGoal.value
    })
    
    if (response.data) {
      emit('success', response.data)
      emit('close')
    }
  } catch (error) {
    console.error('设置学习目标失败:', error)
    alert('设置失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 点击遮罩层关闭
const handleOverlayClick = () => {
  if (!isLoading.value) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 32px 32px 20px;
  text-align: center;
  border-bottom: 1px solid #f1f3f4;
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-header p {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
}

.modal-body {
  padding: 32px;
}

.goal-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.goal-option {
  padding: 20px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.goal-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.goal-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.goal-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.goal-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.goal-desc {
  font-size: 12px;
  opacity: 0.8;
}

.custom-goal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-goal label {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.custom-input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-footer {
  padding: 20px 32px 32px;
  text-align: center;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header {
    padding: 24px 20px 16px;
  }
  
  .modal-header h2 {
    font-size: 24px;
  }
  
  .modal-body {
    padding: 24px 20px;
  }
  
  .goal-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .goal-option {
    padding: 16px 12px;
  }
  
  .goal-number {
    font-size: 24px;
  }
  
  .modal-footer {
    padding: 16px 20px 24px;
  }
}

@media (max-width: 480px) {
  .goal-options {
    grid-template-columns: 1fr;
  }
  
  .goal-option {
    padding: 20px 16px;
  }
}
</style>
