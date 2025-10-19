<template>
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <!-- 品牌与Logo -->
                <div class="brand-section" style="display: flex; justify-content: center; align-items: center; width: 100%;">
                    <div class="logo" style="display: flex; align-items: center;">
                        <h2 style="display: flex; align-items: center; gap: 4px;">
                            <img src="@/assets/img/logo.svg" alt="LearnTechWords" style="width: 30px; height: 30px;">
                            LearnTechWords
                        </h2>
                    </div>
                </div>

                <!-- 联系我们 -->
                <div class="contact-section">
                    <h3 class="contact-title">联系我们</h3>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon"><i class="iconfont icon-youxiang"></i></span>
                            <a href="mailto:1481606459@qq.com">1481606459@qq.com</a>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon"><i class="iconfont icon-dianhua"></i></span>
                            <a>xxx-xxxx-xxxx</a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="footer-bottom">
            <div class="bottom-container">
                <div class="copyright">
                    <span>© {{ currentYear }}  LearnTechWords. 学习使用</span>
                </div>
                <div class="legal">
                    <a href="/user-agreement">隐私政策</a>
                    <span class="sep">|</span>
                    <a href="/user-agreement">用户协议</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.site-footer {
    color: #e2e8f0;
    background: #36373e;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 2rem 20px 2rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
}

.brand-section .logo h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 800;
    background: #ffffff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.contact-section {
    flex-shrink: 0;
}

.contact-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: #f7fafc;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-icon {
    font-size: 1rem;
    opacity: 0.8;
}

.contact-item a {
    color: #cbd5e0;
    text-decoration: none;
    transition: color 0.2s ease;
    font-size: 0.9rem;
}

.contact-item a:hover {
    color: #667eea;
}

.footer-bottom {
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.copyright {
    color: #a0aec0;
    font-size: 0.85rem;
}

.legal {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.legal a {
    text-decoration: none;
    color: #a0aec0;
    font-size: 0.85rem;
    transition: color 0.2s ease;
}

.legal a:hover {
    color: #667eea;
}

.sep {
    color: #718096;
}

/* 响应式设计 */


@media (max-width: 480px) {
    .footer-container {
        padding: 25px 1rem 12px 1rem;
    }

    .brand-section .logo h2 {
        font-size: 1.4rem;
    }

    .contact-title {
        font-size: 1rem;
    }

    .contact-item a {
        font-size: 0.85rem;
    }

    .copyright {
        font-size: 0.8rem;
    }

    .legal a {
        font-size: 0.8rem;
    }
}
</style>
