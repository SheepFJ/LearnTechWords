<template>
  <div class="introduce-container">
    <div class="header">
      <img src="@/assets/img/logo.svg" alt="云上考证" class="logo" />
      <h1>云上考证项目介绍</h1>
      <p class="subtitle">Vue3 + TypeScript + Flask + MySQL 全栈技能认证平台</p>
    </div>
    <div class="content">
      <section class="section">
        <h2><i class="iconfont icon-code"></i> 前端技术栈</h2>
        <ul>
          <li><b>Vue3</b>：采用 Composition API，提升组件复用性与开发效率</li>
          <li><b>TypeScript</b>：为项目提供类型安全，减少运行时错误</li>
          <li><b>HTML5 & CSS3</b>：响应式布局，兼容多端设备</li>
          <li><b>JavaScript</b>：灵活实现页面交互与数据处理</li>
        </ul>
      </section>
      <section class="section">
        <h2><i class="iconfont icon-server"></i> 后端技术栈</h2>
        <ul>
          <li><b>Python</b>：后端主力开发语言，简洁高效</li>
          <li><b>Flask</b>：轻量级 Web 框架，快速搭建 RESTful API</li>
          <li><b>MySQL</b>：关系型数据库，安全可靠地存储用户与认证数据</li>
        </ul>
      </section>
      <section class="section">
        <h2><i class="iconfont icon-rocket"></i> 项目亮点</h2>
        <ul>
          <li>支持用户注册、登录与权限管理，安全性高</li>
          <li>多种技能证书信息一站式查询与管理</li>
          <li>前后端分离，接口规范清晰，易于维护与扩展</li>
          <li>界面美观，交互友好，适配 PC 与移动端</li>
        </ul>
      </section>
      <section class="section">
        <h2><i class="iconfont icon-link"></i> 开源与学习</h2>
        <p>
          本项目适合学习全栈开发、Vue3 组件化、TypeScript 类型系统、Flask API 设计与数据库建模等内容。<br>
          欢迎 Star、Fork 与交流！
        </p>
      </section>
    </div>
    <div class="footer">
      <span>© 2024 云上考证 | 技能认证平台</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可根据需要引入图标库或其他依赖
</script>

<style scoped>
.introduce-container {
  max-width: 800px;
  margin: 60px auto 40px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 36px 32px 24px 32px;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans', Arial, sans-serif;
  color: #222;
  animation: fadeIn 0.8s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.header {
  text-align: center;
  margin-bottom: 32px;
}
.logo {
  height: 54px;
  margin-bottom: 10px;
  vertical-align: middle;
}
.header h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  color: #2d8cf0;
  font-weight: 700;
}
.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0;
}
.content {
  margin-top: 10px;
}
.section {
  margin-bottom: 32px;
  background: #f7fafd;
  border-radius: 10px;
  padding: 22px 20px 16px 20px;
  box-shadow: 0 1px 4px rgba(45,140,240,0.04);
  transition: box-shadow 0.2s;
}
.section:hover {
  box-shadow: 0 4px 16px rgba(45,140,240,0.10);
}
.section h2 {
  font-size: 1.25rem;
  color: #2d8cf0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section ul {
  padding-left: 20px;
  margin: 0;
}
.section li {
  margin-bottom: 8px;
  font-size: 1rem;
  line-height: 1.7;
  list-style: disc;
}
.section b {
  color: #2d8cf0;
}
.section p {
  font-size: 1rem;
  color: #444;
  margin: 0;
}
.footer {
  text-align: center;
  margin-top: 30px;
  color: #aaa;
  font-size: 0.95rem;
  letter-spacing: 1px;
}
@media (max-width: 600px) {
  .introduce-container {
    padding: 18px 6px 12px 6px;
  }
  .header h1 {
    font-size: 1.3rem;
  }
  .section {
    padding: 12px 8px 8px 8px;
  }
}
</style>