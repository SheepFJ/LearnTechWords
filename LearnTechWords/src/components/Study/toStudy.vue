<template>
  <div class="study-container">

    <!-- 返回按钮 -->
     <button @click="$router.push('/study')" class="back-button">
        <i class="iconfont icon-fanhui"></i>
        返回
    </button> 

    

    <!-- 单词显示区域 -->
    <div v-if="currentWord" class="word-display-section">
      <div class="word-card">
        <h1 class="word-title">
          {{ currentWord.word }}
          
        </h1>
        <span class="word-zhushi" v-if="zhushiplay">
            /
            {{
              currentWord.cn
                ? currentWord.cn
                : (currentWord.word_n ? currentWord.word_n : (currentWord.word_v ? currentWord.word_v : ''))
            }}
            /
          </span>

        <h2 class="word-definition">/{{ currentWord.sound }}/</h2>
      </div>
    </div>

    <!-- 中间内容区域 -->
    <div class="middle-content-section">
      <!-- 阶段1: 鼓励内容 -->
      <div v-if="currentStage === 'encouragement'" class="encouragement-section">
        <div class="encouragement-content">
          <div class="encouragement-icon">💪</div>
          <h3 class="encouragement-title">加油！继续学习</h3>
          <p class="encouragement-text">点击下方按钮，告诉我你对这个单词的掌握程度</p>
          <div class="encouragement-tips">
            <span class="tip-item"  @click="handleWordAction('know')" 
            :disabled="isSubmitting">✨ 认识 - 你已经掌握了这个单词</span>
            <span class="tip-item"  @click="handleWordAction('vague')" 
            :disabled="isSubmitting">🤔 模糊 - 需要加强记忆</span>
            <span class="tip-item"  @click="handleWordAction('forget')" 
            :disabled="isSubmitting">❓ 忘记 - 需要重新学习</span>
          </div>
        </div>
      </div>

      <!-- 阶段3: AI建议和翻译详情同时显示 -->
      <div v-if="currentStage === 'ai-and-translation'" class="ai-and-translation-section">
        <!-- AI建议区域 -->
        <div class="ai-suggestion-part">
          <div class="ai-assistant-content">
            <div class="ai-icon">🤖</div>
            <h3 class="ai-title">AI记忆助手</h3>
            <p class="ai-description">获取AI记忆建议，帮助你更好地记住这个单词</p>
            
            <!-- AI建议显示区域 -->
            <div v-if="aiSuggestion" class="ai-suggestion">
              <div class="suggestion-header">
                <span class="suggestion-label">💡 AI建议</span>
              </div>
              <div class="suggestion-content">
                <p>{{ aiSuggestion }}</p>
              </div>
            </div>
            
            <!-- AI辅助按钮 -->
            <button 
              @click="getAISuggestion" 
              class="ai-btn"
              :disabled="isLoadingAI"
            >
              <span v-if="isLoadingAI" class="loading-spinner-small"></span>
              <i v-else class="iconfont icon-robot"></i>
              {{ isLoadingAI ? 'AI思考中...' : '获取记忆建议' }}
            </button>
          </div>
        </div>

        <!-- 翻译详情区域 -->
        <div class="translation-part">
          <ChaoXingTranslateStudy :word="currentWord?.word" />
        </div>
      </div>
    </div>

    <!-- 底部按钮区域 -->
    <div class="bottom-buttons">
      <div class="action-buttons">
        <button 
          @click="handleWordAction('know')" 
          class="action-btn know-btn"
          :disabled="isSubmitting"
        >
          <i class="iconfont icon-check"></i>
          认识
        </button>
        <button 
          @click="handleWordAction('vague')" 
          class="action-btn vague-btn"
          :disabled="isSubmitting"
        >
          <i class="iconfont icon-question"></i>
          模糊
        </button>
        <button 
          @click="handleWordAction('forget')" 
          class="action-btn forget-btn"
          :disabled="isSubmitting"
        >
          <i class="iconfont icon-close"></i>
          忘记
        </button>
      </div>
      
      <!-- 下一个按钮 -->
      <button 
        v-if="currentStage === 'ai-and-translation'" 
        @click="loadNextWord" 
        class="next-btn"
        :disabled="isLoading"
      >
        <i class="iconfont icon-right"></i>
        下一个
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <i class="iconfont icon-cuowu"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { myhost } from '@/types/myhost'
import ChaoXingTranslateStudy from './ChaoXingTranslateStudy.vue'

// 响应式数据
const currentWord = ref(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const currentStage = ref('encouragement') // 'encouragement', 'ai', 'translation'
const isLoadingAI = ref(false)
const aiSuggestion = ref('')

const zhushiplay = ref(false)

// 获取单词
const fetchWord = async () => {
  isLoading.value = true
  errorMessage.value = ''
  currentStage.value = 'encouragement'
  aiSuggestion.value = ''
  
  try {
    const response = await axios.post(`${myhost.api}/getword`, {
      user_info: JSON.parse(localStorage.getItem('user_info') || '{}')
    })
    
    if (response.data && response.data.data) {
      currentWord.value = response.data.data
    } else {
      errorMessage.value = '获取单词失败'
    }
  } catch (error) {
    console.error('获取单词失败:', error)
    errorMessage.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 处理单词操作
const handleWordAction = async (action) => {
  if (!currentWord.value) return
  
  isSubmitting.value = true
  
  try {
    // 提交学习记录
    await axios.post(`${myhost.api}/record/submission`, {
      serial_number: currentWord.value.serial_number,
      action: action
    })
    
    // 直接进入显示AI建议和翻译的阶段
    if (currentStage.value === 'encouragement') {
        // 将zhushiplay设置为true
        zhushiplay.value = true

        
      currentStage.value = 'ai-and-translation'
    }
    
  } catch (error) {
    console.error('提交学习记录失败:', error)
    errorMessage.value = '提交失败，请重试'
  } finally {
    isSubmitting.value = false
  }
}

// 获取AI建议
const getAISuggestion = async () => {
  if (!currentWord.value?.word) return
  
  isLoadingAI.value = true
  aiSuggestion.value = ''
  
  try {
    const response = await axios.get(`${myhost.api}/word/aibot/${encodeURIComponent(currentWord.value.word)}`)
    
    if (response.data && response.data.suggestion) {
      aiSuggestion.value = response.data.suggestion
    } else if (response.data && response.data.data) {
      aiSuggestion.value = response.data.data
    } else {
      aiSuggestion.value = '抱歉，暂时无法获取AI建议，请稍后重试。'
    }
  } catch (error) {
    console.error('获取AI建议失败:', error)
    aiSuggestion.value = '获取AI建议失败，请检查网络连接或稍后重试。'
  } finally {
    isLoadingAI.value = false
  }
}

// 加载下一个单词
const loadNextWord = () => {
  fetchWord()
}

// 组件挂载时获取第一个单词
onMounted(() => {
  fetchWord()
})
</script>

<style scoped>
.study-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
}

.word-display-section {
  position: sticky;
  top: 0;
  z-index: 10;
  /* background: white; */
  padding: 30px 20px;
  transition: all 0.3s ease;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

.word-card {
  background: transparent;
  padding: 0;
  background-color: #8fa1f3;
  text-align: center;
  border-radius: 10px;
  width: 100%;
}

.word-title {
  font-size: 56px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  text-transform: capitalize;
}

.middle-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.encouragement-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  /* background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); */
  min-height: calc(100vh - 200px);
}

.encouragement-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.encouragement-icon {
  font-size: 48px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.encouragement-title {
  font-size: 28px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 16px 0;
}

.encouragement-text {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.encouragement-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.tip-item {
  background: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  color: #495057;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 300px;
  width: 100%;
}

.tip-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ai-assistant-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}
.back-button {
  position: fixed;
  top: 40px;
  left: 30px;
  z-index: 2000;
  background: #ffffffcc;
  border: none;
  border-radius: 100px;
  box-shadow: 0 4px 16px rgba(80,100,120,0.20);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: box-shadow 0.3s, background 0.3s;
}
.back-button:hover {
  background: #f1f3f4cc;
  box-shadow: 0 8px 24px rgba(80,100,120,0.24);
}

.ai-assistant-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.ai-and-translation-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-suggestion-part {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 30px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.translation-part {
  flex: 1;
  padding: 20px;
  border-radius: 20px;
  margin-top: 20px;
  padding-bottom: 150px;
  background: white;
}

.translation-section {
  flex: 1;
  padding: 20px;
  padding-bottom: 150px;
}

.ai-icon {
  font-size: 48px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.ai-title {
  font-size: 28px;
  font-weight: 600;
  color: #1976d2;
  margin: 0 0 16px 0;
}

.ai-description {
  font-size: 16px;
  color: #424242;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.ai-suggestion {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1976d2;
}

.suggestion-header {
  margin-bottom: 15px;
}

.suggestion-label {
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
}

.suggestion-content p {
  font-size: 15px;
  color: #424242;
  line-height: 1.6;
  margin: 0;
}

.ai-btn {
  background: linear-gradient(135deg, #8fa1f3 0%, #6d82e0 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
}

.ai-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.ai-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}


.translation-section {
  flex: 1;
  padding: 20px;
}

.bottom-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 15px;
  flex-direction: row;
}
.word-zhushi {
  font-size: 24px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 16px 0;
  text-transform: capitalize;
}

.action-btn {
  flex: 1;
  max-width: 120px;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.know-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.vague-btn {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
}

.forget-btn {
  background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%);
  color: white;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.next-btn {
  width: 100%;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.next-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #f8d7da;
  color: #721c24;
  padding: 15px 25px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1001;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .word-display-section {
    padding: 20px 15px;
  }
  
  .word-title {
    font-size: 42px;
  }
  
  .encouragement-section {
    padding: 30px 15px;
    min-height: calc(100vh - 150px);
  }
  
  .ai-suggestion-part {
    padding: 25px 15px;
    min-height: 250px;
  }
  
  .translation-part {
    padding: 15px;
    padding-bottom: 120px;
  }
  
  .encouragement-icon,
  .ai-icon {
    font-size: 36px;
  }
  
  .encouragement-title,
  .ai-title {
    font-size: 24px;
  }
  
  .encouragement-text,
  .ai-description {
    font-size: 15px;
  }
  
  .encouragement-tips {
    gap: 10px;
  }
  
  .tip-item {
    padding: 10px 16px;
    font-size: 13px;
    max-width: 280px;
  }
  
  .ai-suggestion {
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .suggestion-content p {
    font-size: 14px;
  }
  
  .ai-btn {
    padding: 12px 24px;
    font-size: 15px;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 10px;
  }
  
  .action-btn {
    max-width: none;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .bottom-buttons {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .word-display-section {
    padding: 15px 10px;
  }
  
  .word-title {
    font-size: 32px;
  }
  
  .encouragement-section {
    padding: 20px 10px;
    min-height: calc(100vh - 120px);
  }
  
  .ai-suggestion-part {
    padding: 20px 10px;
    min-height: 200px;
  }
  
  .encouragement-icon,
  .ai-icon {
    font-size: 32px;
  }
  
  .encouragement-title,
  .ai-title {
    font-size: 20px;
  }
  
  .encouragement-text,
  .ai-description {
    font-size: 14px;
  }
  
  .tip-item {
    padding: 8px 12px;
    font-size: 12px;
    max-width: 250px;
  }
  
  .ai-suggestion {
    padding: 12px;
    margin-bottom: 15px;
  }
  
  .suggestion-content p {
    font-size: 13px;
  }
  
  .ai-suggestion-part {
    padding: 15px 10px;
  }
  
  .translation-part {
    padding: 10px;
    padding-bottom: 100px;
  }
  
  .ai-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .action-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>