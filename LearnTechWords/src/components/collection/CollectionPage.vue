<template>
    <div class="collection-modal" v-if="visible" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>{{ title }}</h2>
                <button class="close-btn" @click="closeModal">×</button>
            </div>
            
            <div class="modal-body">
                <div v-if="loading" class="loading">
                    <div class="spinner"></div>
                    <p>搜索中...</p>
                </div>
                
                <div v-else-if="searchResults.length === 0 && !loading" class="no-results">
                    <p>暂无搜索结果</p>
                </div>
                
                <div v-else class="results-list">
                    <div 
                        v-for="item in searchResults" 
                        :key="item._id || item.id"
                        class="result-item"
                        @click="selectItem(item)"
                    >
                        <div class="item-title">{{ item.title || item.question || item.typename }}</div>
                        <div class="item-content">{{ item.content || item.introduce || item.answer }}</div>
                        <div class="item-meta">
                            <span v-if="item.type">{{ item.type }}</span>
                            <span v-if="item.level">{{ item.level }}</span>
                            <span v-if="item.created_at">{{ formatDate(item.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-secondary" @click="closeModal">关闭</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { request } from '@/axios.ts'

interface SearchResult {
    _id?: string
    id?: number
    title?: string
    question?: string
    typename?: string
    content?: string
    introduce?: string
    answer?: string
    type?: string
    level?: string
    created_at?: string
}

interface Props {
    visible: boolean
    title?: string
    searchKeyword?: string
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    title: '搜索结果',
    searchKeyword: ''
})

const emit = defineEmits<{
    close: []
    select: [item: SearchResult]
}>()

const searchResults = ref<SearchResult[]>([])
const loading = ref(false)

// 监听搜索关键词变化
const searchKeyword = computed(() => props.searchKeyword)

// 搜索功能
const performSearch = async (keyword: string) => {
    if (!keyword.trim()) {
        searchResults.value = []
        return
    }
    
    loading.value = true
    try {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
        const response = await request({
            url: '/search',
            method: 'post',
            data: {
                uid: userInfo.uid,
                keyword: keyword.trim()
            }
        })
        
        searchResults.value = response.data || []
    } catch (error) {
        console.error('搜索失败:', error)
        searchResults.value = []
    } finally {
        loading.value = false
    }
}

// 选择项目
const selectItem = (item: SearchResult) => {
    emit('select', item)
}

// 关闭弹窗
const closeModal = () => {
    emit('close')
}

// 格式化日期
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
}

// 监听搜索关键词变化
watch(() => props.searchKeyword, (newKeyword) => {
    if (props.visible && newKeyword) {
        performSearch(newKeyword)
    }
}, { immediate: true })
</script>

<style scoped>
.collection-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e5e5;
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #333;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-results {
    text-align: center;
    padding: 40px;
    color: #666;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.result-item {
    padding: 16px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.result-item:hover {
    border-color: #007bff;
    background: #f8f9fa;
}

.item-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.item-content {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.item-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #999;
}

.item-meta span {
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
}

.modal-footer {
    padding: 20px 24px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: flex-end;
}

.btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.btn-secondary:hover {
    background: #5a6268;
}
</style>
