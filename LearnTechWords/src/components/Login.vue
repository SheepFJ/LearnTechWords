<template>
  <div class="login-container">
    <div class="login-card">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
        <img src="@/assets/img/logo.svg" alt="LearnTechWords" class="logo" style="height: 38px;">
        <h1 style="margin: 0; font-size: 1.4rem;">LearnTechWords</h1>
      </div>
      <!-- 头部切换按钮 -->
      <div class="tab-header">
       
        <button 
          :class="['tab-btn', { active: isLogin }]"
          @click="switchToLogin"
        >
          <i class="iconfont icon-denglu"></i> 登录
        </button>
        <button 
          :class="['tab-btn', { active: !isLogin }]"
          @click="switchToRegister"
        >
          <i class="iconfont icon-zhucetianjiahaoyou"></i> 注册
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            :class="{ error: errors.username }"
            @blur="validateUsername(loginForm.username)"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码（英文或数字）"
            :class="{ error: errors.password }"
            @blur="validatePassword(loginForm.password)"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            placeholder="请输入用户名（3-6个字符）"
            :class="{ error: errors.username }"
            @blur="validateUsername(registerForm.username)"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="register-password">密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（英文或数字）"
            :class="{ error: errors.password }"
            @blur="validatePassword(registerForm.password)"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirm-password">确认密码</label>
          <input
            id="confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :class="{ error: errors.confirmPassword }"
            @blur="validateConfirmPassword"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-toast">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { LoginForm, RegisterForm, FormErrors } from '../types/login'
import axios from 'axios'
import router from '@/router'
import { myhost } from '@/types/myhost'

// 响应式数据
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

// 表单数据
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: ''
})

// 表单验证错误
const errors = reactive<FormErrors>({})

// 验证规则
const validationRules = {
  username: {
    minLength: 3,
    maxLength: 6,
    pattern: /^.{3,6}$/,
    message: '用户名需为3-6个字符'
  },
  password: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: '密码只能包含英文或数字'
  }
}

// 切换登录/注册
const switchToLogin = () => {
  isLogin.value = true
  clearForm()
  clearErrors()
}

const switchToRegister = () => {
  isLogin.value = false
  clearForm()
  clearErrors()
}

// 清空表单
const clearForm = () => {
  loginForm.username = ''
  loginForm.password = ''
  registerForm.username = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
}

// 清空错误信息
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
  errorMessage.value = ''
}

// 验证用户名
const validateUsername = (username: string) => {
  if (!username) {
    errors.username = '用户名不能为空'
    return false
  }
  if (username.length < validationRules.username.minLength) {
    errors.username = validationRules.username.message
    return false
  }
  if (username.length > validationRules.username.maxLength) {
    errors.username = validationRules.username.message
    return false
  }
  delete errors.username
  return true
}

// 验证密码
const validatePassword = (password: string) => {
  if (!password) {
    errors.password = '密码不能为空'
    return false
  }
  if (!validationRules.password.pattern.test(password)) {
    errors.password = validationRules.password.message
    return false
  }
  if (password.length < 6) {
    errors.password = '密码长度需大于6位'
    return false
  }
  delete errors.password
  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!registerForm.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    return false
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    return false
  }
  delete errors.confirmPassword
  return true
}

// 验证整个表单
const validateForm = () => {
  const isLoginMode = isLogin.value
  let isValid = true

  if (isLoginMode) {
    isValid = validateUsername(loginForm.username) && validatePassword(loginForm.password)
  } else {
    isValid = validateUsername(registerForm.username) && 
              validatePassword(registerForm.password) && 
              validateConfirmPassword()
  }

  return isValid
}

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // await new Promise(resolve => setTimeout(resolve, 1000))
    let data1 = await axios.post(myhost.api + "/login", loginForm)
    console.log(data1.data)   
    // 这里可以调用实际的登录API
    console.log('登录信息:', loginForm)
    
    // 登录成功后的处理
    // 可以跳转到其他页面或触发父组件事件
    // alert('登录成功！')
    // 存储token
    localStorage.setItem('user_token', data1.data.token)
    localStorage.setItem('user_info', JSON.stringify(data1.data))
    // 跳转到首页
    router.push('/home')
    
    
  } catch (error) {
    errorMessage.value = '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 模拟API调用
    // await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里可以调用实际的注册API
    console.log('注册信息:', registerForm)
    let data1 = await axios.post(myhost.api + "/register", registerForm)

    // 注册成功后的处理
    // alert('注册成功！请登录')
    switchToLogin()
    
  } catch (error) {
    errorMessage.value = '注册失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  z-index: 9999;
}

.login-card {
  background: white;
  border-radius: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 80%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
}



.tab-header {
  display: flex;
  margin-bottom: 30px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.iconfont {
  font-size: 20px;
}

.submit-btn:disabled {
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

.error-toast {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {


  .login-card {
    padding: 30px 20px;
    border-radius: 15px;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .form-group input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px 15px;
  }
  
  .tab-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .form-group input {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .submit-btn {
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
