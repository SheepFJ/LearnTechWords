<template>
   

    <ResearchDisplay />

    <CeShi />
</template>

<script setup lang="ts">
import CeShi from '@/components/Home/CeShi.vue'
import ResearchDisplay from '@/components/Home/ResearchDisplay.vue'
</script>

<style scoped>
    .home-heard {
        width: 100vw;
        height: 40vh;
        background: linear-gradient(103deg,#e7f4ff 27%,#bad8ff 93%);
        position: relative;
        left: 50%;
        right: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
    }
    .home-heard-body {
        padding-top: 100px;
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
</style>
