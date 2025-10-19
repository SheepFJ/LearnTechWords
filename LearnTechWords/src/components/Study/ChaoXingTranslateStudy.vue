<template>
  <div class="translate-container">
    <div class="translate-header">
      <h1>详细<span>翻译</span>信息</h1>
      <p>单词: <strong>{{ word }}</strong></p>
    </div>

    <!-- 翻译结果 -->
    <div v-if="translationResult" class="result-section">
      <div class="word-card">
        <div class="word-header">
          <h2 class="word-title">{{ translationResult.word }}  <i class="iconfont icon-shoucang"></i></h2> 
          <div class="pronunciation">
            <div class="ipa">
              <span class="label">IPA:</span>
              <span class="value">{{ translationResult.ipa }}</span>
              <button 
                v-if="translationResult.ipaAudio" 
                @click="playAudio(translationResult.ipaAudio)"
                class="audio-btn"
                title="播放发音"
              >
                <i class="iconfont icon-shengyin"></i>
              </button>
            </div>
            <div class="kk">
              <span class="label">KK:</span>
              <span class="value">{{ translationResult.kk }}</span>
              <button 
                v-if="translationResult.kkAudio" 
                @click="playAudio(translationResult.kkAudio)"
                class="audio-btn"
                title="播放发音"
              >
                <i class="iconfont icon-shengyin"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 释义 -->
        <div class="definition-section">
          <h3 class="section-title">释义:</h3>
          <div class="definitions">
            <div 
              v-for="(meaning, partOfSpeech) in translationResult.paraphrase" 
              :key="partOfSpeech"
              class="definition-item"
            >
              <span class="part-of-speech">{{ partOfSpeech }}</span>
              <span class="meaning">{{ meaning }}</span>
            </div>
          </div>
        </div>

        <!-- 例句 -->
        <div class="examples-section">
          <h3 class="section-title">例句:</h3>
          <div class="examples">
            <div 
              v-for="(example, index) in parsedExamples" 
              :key="index"
              class="example-item"
            >
              <div class="example-en" v-html="example.english"></div>
              <div class="example-cn">{{ example.chinese }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <i class="iconfont icon-cuowu"></i>
      {{ errorMessage }}
    </div>

    <!-- 空状态 -->
    <div v-if="!translationResult && !isLoading && hasSearched" class="empty-state">
      <i class="iconfont icon-kong"></i>
      <p>未找到相关翻译结果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { myhost } from '@/types/myhost'

const props = defineProps(['word'])

// 响应式数据
const isLoading = ref(false)
const errorMessage = ref('')
const hasSearched = ref(false)
const translationResult = ref(null)

// 解析例句
const parsedExamples = computed(() => {
  if (!translationResult.value?.sentence) return []
  
  const sentences = translationResult.value.sentence.split('<br><br>')
  return sentences.map(sentence => {
    const parts = sentence.split('<br>')
    if (parts.length >= 2) {
      return {
        english: parts[0].replace(/<span>/g, '<mark>').replace(/<\/span>/g, '</mark>'),
        chinese: parts[1]
      }
    }
    return { english: sentence, chinese: '' }
  }).filter(example => example.english.trim())
})

// 处理搜索
const handleSearch = async (wordToSearch) => {
  if (!wordToSearch.trim()) return
  
  isLoading.value = true
  errorMessage.value = ''
  hasSearched.value = true
  
  try {
    const response = await axios.get(`${myhost.api}/chaoxing/translate/${encodeURIComponent(wordToSearch.trim())}`)
    
    if (response.data.code === 1 && response.data.data?.dictionary) {
      translationResult.value = response.data.data.dictionary
    } else {
      errorMessage.value = '未找到该单词的翻译信息'
      translationResult.value = null
    }
  } catch (error) {
    console.error('翻译请求失败:', error)
    errorMessage.value = '翻译失败，请检查网络连接或稍后重试'
    translationResult.value = null
  } finally {
    isLoading.value = false
  }
}

// 监听word变化，自动搜索
watch(() => props.word, (newWord) => {
  if (newWord) {
    handleSearch(newWord)
  }
}, { immediate: true })

// 组件挂载时自动搜索
onMounted(() => {
  if (props.word) {
    handleSearch(props.word)
  }
})

// 播放音频
const playAudio = (audioPath) => {
  if (!audioPath) return
  
  const audio = new Audio('https://appcd.chaoxing.com/bilingual-reader/'+`${audioPath}`)
  audio.play().catch(error => {
    console.error('音频播放失败:', error)
  })
}
</script>

<style scoped>
.translate-container {
  min-height: 20vh;
  padding: 0px 0;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
}

.translate-header {
  text-align: center;
  margin-bottom: 40px;
}

.translate-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.translate-header p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}


.result-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.word-card {
  background: white;

  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.word-header {
  border-bottom: 2px solid #f1f3f4;
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.word-title {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  text-transform: capitalize;
}

.pronunciation {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.ipa, .kk {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.label {
  font-weight: 600;
  color: #6c757d;
  min-width: 40px;
}

.value {
  font-family: 'Courier New', monospace;
  color: #495057;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.audio-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.audio-btn:hover {
  background: #5a6fd8;
  transform: scale(1.1);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
  display: inline-block;
}

.definition-section {
  margin-bottom: 32px;
}

.definitions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.definition-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.part-of-speech {
  font-weight: 600;
  color: #667eea;
  min-width: 80px;
  font-size: 14px;
}

.meaning {
  color: #495057;
  line-height: 1.6;
  flex: 1;
}

.examples-section {
  margin-bottom: 20px;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.example-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #28a745;
}

.example-en {
  font-size: 16px;
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 12px;
}

.example-en :deep(mark) {
  background: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.example-cn {
  font-size: 15px;
  color: #6c757d;
  line-height: 1.6;
  font-style: italic;
}

.error-message {
  max-width: 800px;
  margin: 20px auto;
  padding: 16px 24px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  font-size: 18px;
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .translate-header h1 {
    font-size: 28px;
  }
  
  .word-card {
    padding: 20px;
  }
  
  .word-title {
    font-size: 36px;
  }
  
  .pronunciation {
    flex-direction: column;
    gap: 16px;
  }
  
  .definition-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .part-of-speech {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .translate-container {
    padding: 20px 0;
  }
  
  .word-card {
    padding: 16px;
    padding-bottom: 100px;
  }
  
  .word-title {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>
