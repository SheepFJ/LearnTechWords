<template>
    <HomeBtn />
  <div class="user-agreement">
    <div class="agreement-container">
      <div class="agreement-header">
        <h1>LearnTechWords 用户协议</h1>
        <p class="update-date">最后更新时间：2024年12月</p>
      </div>

      <div class="agreement-content">
        <section class="agreement-section">
          <h2>1. 服务说明</h2>
          <p>LearnTechWords 是一款个人开发的英语单词学习应用，旨在帮助用户通过科学的方法学习和记忆英语单词。本应用提供单词学习、AI辅助记忆、翻译查询等功能。</p>
        </section>

        <section class="agreement-section">
          <h2>2. 用户权利与义务</h2>
          <h3>2.1 用户权利</h3>
          <ul>
            <li>免费使用本应用的基本学习功能</li>
            <li>获得AI辅助记忆建议</li>
            <li>查看详细的单词翻译和例句</li>
            <li>记录个人学习进度</li>
            <li>随时停止使用本应用</li>
          </ul>
          
          <h3>2.2 用户义务</h3>
          <ul>
            <li>提供真实、准确的个人信息</li>
            <li>不得将本应用用于商业用途</li>
            <li>不得恶意攻击或破坏应用系统</li>
            <li>不得传播违法、有害信息</li>
            <li>遵守相关法律法规</li>
          </ul>
        </section>

        <section class="agreement-section">
          <h2>3. 隐私保护</h2>
          <p>我们重视您的隐私保护，承诺：</p>
          <ul>
            <li>仅收集必要的用户信息用于提供学习服务</li>
            <li>不会向第三方出售或泄露您的个人信息</li>
            <li>采用安全措施保护您的数据安全</li>
            <li>您有权要求删除个人数据</li>
          </ul>
        </section>

        <section class="agreement-section">
          <h2>4. 服务内容</h2>
          <h3>4.1 核心功能</h3>
          <ul>
            <li>单词学习：提供英语单词的学习和记忆功能</li>
            <li>AI辅助：基于人工智能的记忆建议</li>
            <li>翻译查询：详细的单词释义和例句</li>
            <li>学习记录：跟踪学习进度和效果</li>
          </ul>
          
          <h3>4.2 服务限制</h3>
          <ul>
            <li>本应用仅供个人学习使用</li>
            <li>不保证服务的连续性和稳定性</li>
            <li>可能因维护需要暂停服务</li>
            <li>功能可能根据需要进行调整</li>
          </ul>
        </section>

        <section class="agreement-section">
          <h2>5. 知识产权</h2>
          <p>本应用的所有内容，包括但不限于：</p>
          <ul>
            <li>应用软件、界面设计、图标等</li>
            <li>学习内容、单词数据、例句等</li>
            <li>AI算法、技术方案等</li>
            <li>商标、版权等知识产权</li>
          </ul>
          <p>均受相关法律法规保护，未经许可不得复制、传播或用于商业用途。</p>
        </section>

        <section class="agreement-section">
          <h2>6. 免责声明</h2>
          <p>使用本应用时，请注意：</p>
          <ul>
            <li>本应用仅供参考学习，不保证学习效果</li>
            <li>不对因使用本应用造成的任何损失承担责任</li>
            <li>不保证翻译内容的完全准确性</li>
            <li>用户应自行判断学习内容的适用性</li>
            <li>因网络问题导致的服务中断不承担责任</li>
          </ul>
        </section>

        <section class="agreement-section">
          <h2>7. 协议变更</h2>
          <p>我们保留随时修改本协议的权利。协议变更后，我们将通过应用内通知或其他方式告知用户。继续使用本应用即表示您同意修改后的协议。</p>
        </section>

        <section class="agreement-section">
          <h2>8. 争议解决</h2>
          <p>如因使用本应用产生争议，双方应友好协商解决。协商不成的，可向有管辖权的人民法院提起诉讼。</p>
        </section>

        <section class="agreement-section">
          <h2>9. 联系方式</h2>
          <p>如有任何问题或建议，请通过以下方式联系我们：</p>
          <ul>
            <li>应用内反馈功能</li>
            <li>邮箱：support@learntechwords.com</li>
            <li>我们将在合理时间内回复您的咨询</li>
          </ul>
        </section>

        <section class="agreement-section">
          <h2>10. 其他条款</h2>
          <ul>
            <li>本协议的解释权归 LearnTechWords 所有</li>
            <li>如本协议部分条款无效，不影响其他条款的效力</li>
            <li>本协议自您开始使用本应用时生效</li>
            <li>感谢您选择 LearnTechWords，祝您学习愉快！</li>
          </ul>
        </section>
      </div>

      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HomeBtn from '@/components/HeardBtn.vue'

const router = useRouter()
const accepted = ref(false)

const goBack = () => {
  router.go(-1)
}

const acceptAgreement = () => {
  if (accepted.value) {
    // 保存用户同意状态
    localStorage.setItem('agreement_accepted', 'true')
    localStorage.setItem('agreement_accepted_date', new Date().toISOString())
    
    // 跳转到主页面或注册页面
    router.push('/login')
  }
}
</script>

<style scoped>
.user-agreement {
  min-height: 100vh;
  margin-top: 70px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.agreement-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.agreement-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.agreement-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.update-date {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.agreement-content {
  padding: 40px;
  line-height: 1.8;
}

.agreement-section {
  margin-bottom: 32px;
}

.agreement-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.agreement-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #34495e;
  margin: 20px 0 12px 0;
}

.agreement-section p {
  font-size: 16px;
  color: #555;
  margin: 0 0 16px 0;
}

.agreement-section ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.agreement-section li {
  font-size: 15px;
  color: #555;
  margin-bottom: 8px;
}

.agreement-footer {
  background: #f8f9fa;
  padding: 30px 40px;
  border-top: 1px solid #e9ecef;
}

.accept-section {
  margin-bottom: 24px;
}

.accept-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #555;
}

.accept-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.accept-checkbox input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
}

.accept-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-agreement {
    padding: 10px;
  }
  
  .agreement-header {
    padding: 30px 20px;
  }
  
  .agreement-header h1 {
    font-size: 24px;
  }
  
  .agreement-content {
    padding: 20px;
  }
  
  .agreement-section h2 {
    font-size: 20px;
  }
  
  .agreement-section h3 {
    font-size: 16px;
  }
  
  .agreement-section p,
  .agreement-section li {
    font-size: 14px;
  }
  
  .agreement-footer {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .agreement-header h1 {
    font-size: 20px;
  }
  
  .agreement-content {
    padding: 15px;
  }
  
  .agreement-footer {
    padding: 15px;
  }
}
</style>
