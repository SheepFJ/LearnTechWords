<template>
    <div class="ceshi">
        <button @click="xuanzheng">点击选证</button>
        <ul>
            <li v-for="item in zhengce" :key="item._id">{{item.typename}}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import type {User,Users,Certificate} from '@/types'
import { ref,reactive } from 'vue'

let zhengce:Certificate[] = reactive([])

async function xuanzheng(){
    try {
        let data1 = await axios.get("http://api.sheep.cloud.brainiac.top:8003/certificate") 
        console.log(data1.data.data)
        // zhengce.splice(0, zhengce.length, ...data1.data.data)
        Object.assign(zhengce, data1.data.data)
    } catch (error) {
        
    }
    
}


</script>

<style scoped>
.ceshi{
    
    margin-top: 100px;
}
</style>