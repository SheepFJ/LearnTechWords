<template>
    <div>
        <button @click="handleLogin">模拟登陆跳转</button>
    </div>
    <h1 ref="name" @click="btn">{{num1}}</h1>

    <button @click="add">点我加1</button>
    <button @click="xuanzheng">点击选证</button>
    <ul>
        <li v-for="item in zhengce" :key="item._id">{{item.typename}}</li>
    </ul>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {ref,reactive} from 'vue'
import type {User,Users,Certificate} from '@/types'
import useLogin from '@/hooks/useLogin'
import axios from 'axios'

// 结构方法与数据
const {num1,add} = useLogin()



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


//  路由跳转
const router = useRouter()

let name = ref('1231')

const user:User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
}

const user2:Array<User> = [{
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com'
}]

const user3:Users = [{
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    x:'0'
}]

const handleLogin = () => {
    router.push('/home')
    console.log(user)
}

function btn(){
    console.log(name.value)
}


</script>

<style scoped>

</style>
