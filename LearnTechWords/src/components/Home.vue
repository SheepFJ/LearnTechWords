<template>
    <HeardBtn />
    <HomeHeard />
    <!-- <ResearchDisplay /> -->
    <Footer />
</template>

<script setup lang="ts">
import HeardBtn from '@/components/HeardBtn.vue'

import HomeHeard from '@/components/Home/HomeHeard.vue'
import ResearchDisplay from '@/components/Home/ResearchDisplay.vue'

import Footer from '@/components/Footer.vue'

import { onMounted } from 'vue'
import { request } from '@/axios.ts'

// 向 /index 发送请求，验证 token 是否过期
// onMounted(async () => {
//     try {
//         await request({
//             url: '/index',
//             method: 'get'
//         })
//     } catch (error) {
//     }
// })


</script>

<style scoped>

</style>