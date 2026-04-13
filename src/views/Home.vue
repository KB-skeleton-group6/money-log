<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();
const { isLoggedIn } = authStore;
const openAuthModal = inject('openAuthModal', null);

const showScrollTop = ref(false);

const activePreview = ref(0);
const previewTabs = ['대시보드(홈)', '거래 내역', '통계', '마이페이지'];

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const handlePrimaryAction = () => {
  if (isLoggedIn) {
    router.push('/ledger/dashboard');
    return;
  }

  openAuthModal?.();
};

const scrollToIntro = () => {
  const element = document.getElementById('intro');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="landing-page">
    <main id="intro" class="hero-section">
      <div class="hero-content">
        <span class="badge">스마트한 가계부</span>
        <h1 class="title">나만의 체계적인<br />자산 관리 파트너</h1>
        <p class="subtitle">
          직관적인 통계로 소비 패턴을 분석하세요.<br />
          Money Log와 함께 현명한 금융 생활을 시작해 보세요.
        </p>
        <button v-if="!isLoggedIn" class="cta-btn" @click="handlePrimaryAction">
          지금 바로 시작하기
        </button>
        <button
          v-else
          class="cta-btn"
          @click="router.push('/ledger/dashboard')"
        >
          대시보드로 이동하기
        </button>
      </div>
      <div class="hero-image">
        <div class="placeholder-img">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
      </div>

      <div class="scroll-indicator">
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </main>

    <section id="features" class="features-section">
      <div class="features-header">
        <h2>- 핵심 기능 -</h2>
        <p>복잡한 자산 관리를 쉽고 간편하게 만들어주는 기능을 만나보세요.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div>
          <h3>한눈에 보는 대시보드</h3>
          <p>수입과 지출 흐름을 달력과 차트로 직관적으로 파악할 수 있습니다.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-chart-pie"></i></div>
          <h3>상세한 통계 분석</h3>
          <p>
            카테고리별, 기간별 통계를 통해 나의 소비 패턴을 정확하게 분석합니다.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-list-check"></i></div>
          <h3>간편한 내역 관리</h3>
          <p>언제 어디서나 손쉽게 수입과 지출 내역을 기록하고 관리해보세요.</p>
        </div>
      </div>
    </section>

    <section id="preview" class="preview-section">
      <div class="preview-header">
        <h2>- 실제 화면 -</h2>
        <p>군더더기 없는 깔끔한 디자인으로 자산 관리에만 집중하세요.</p>
        <div class="preview-tabs">
          <button
            v-for="(tab, index) in previewTabs"
            :key="index"
            :class="['tab-btn', { active: activePreview === index }]"
            @click="activePreview = index"
          >
            {{ tab }}
          </button>
        </div>
      </div>
      <div class="preview-content">
        <div class="mockup-window">
          <img
            v-show="activePreview === 0"
            src="@/assets/images/main-dashboard.png"
            alt="대시보드 실제 화면"
            class="preview-image"
          />
          <img
            v-show="activePreview === 1"
            src="@/assets/images/transaction-list.png"
            alt="내역 관리 실제 화면"
            class="preview-image"
          />
          <img
            v-show="activePreview === 2"
            src="@/assets/images/statistics-chart.png"
            alt="통계 분석 실제 화면"
            class="preview-image"
          />
          <img
            v-show="activePreview === 3"
            src="@/assets/images/my-page.png"
            alt="마이페이지 실제 화면"
            class="preview-image"
          />
        </div>
      </div>
    </section>

    <button v-if="showScrollTop" class="scroll-top-btn" @click="scrollToIntro">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
}

/* 히어로 섹션 */
.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 60px;
  position: relative;
}
.hero-content {
  flex: 1;
}
.badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e6f7ef;
  color: #28c76f;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 20px;
}
.title {
  font-size: 3rem;
  line-height: 1.3;
  color: #2f3542;
  margin: 0 0 20px 0;
}
.subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #747d8c;
  margin-bottom: 40px;
}
.cta-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  background-color: #20bf6b;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
}
.cta-btn:hover {
  background-color: #1da35b;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}
.placeholder-img {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #e0f2fe 0%, #e6f7ef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  color: #28c76f;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* 스크롤 유도 애니메이션 */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: #20bf6b;
  animation: bounce 2s infinite;
  cursor: pointer;
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-15px) translateX(-50%);
  }
  60% {
    transform: translateY(-7px) translateX(-50%);
  }
}

/* 기능 소개 섹션 */
.features-section {
  padding: 100px 20px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
}
.features-header {
  text-align: center;
  margin-bottom: 60px;
}
.features-header h2 {
  font-size: 2.5rem;
  color: #2f3542;
  margin-bottom: 15px;
}
.features-header p {
  font-size: 1.1rem;
  color: #747d8c;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
.feature-card {
  background: #f8f9fa;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
}
.feature-icon {
  width: 80px;
  height: 80px;
  background: #e6f7ef;
  color: #20bf6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px auto;
}
.feature-card h3 {
  font-size: 1.3rem;
  color: #2f3542;
  margin-bottom: 15px;
}
.feature-card p {
  color: #747d8c;
  line-height: 1.6;
}

/* 실제 화면 미리보기 섹션 */
.preview-section {
  padding: 100px 20px;
  background-color: #f1f2f6; /* 기능 섹션과 대비되는 배경색 */
  width: 100%;
  box-sizing: border-box;
}
.preview-header {
  text-align: center;
  margin-bottom: 60px;
}
.preview-header h2 {
  font-size: 2.5rem;
  color: #2f3542;
  margin-bottom: 15px;
}
.preview-header p {
  font-size: 1.1rem;
  color: #747d8c;
}
.preview-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 10px 24px;
  border: 1px solid #dfe4ea;
  background-color: white;
  color: #747d8c;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.tab-btn:hover {
  background-color: #f1f2f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}
.tab-btn.active {
  background-color: #20bf6b;
  color: white;
  border-color: #20bf6b;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 191, 107, 0.3);
}
.preview-content {
  max-width: 1000px;
  margin: 0 auto;
}
.mockup-window {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #eee;
}
.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 최상단으로 이동 버튼 */
.scroll-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background-color: #20bf6b;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    background-color 0.2s;
  animation: fadeIn 0.3s ease-out;
}
.scroll-top-btn:hover {
  background-color: #1da35b;
  transform: translateY(-3px);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 최적화 (태블릿 & 모바일) */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    justify-content: center;
    padding-bottom: 100px;
  }
  .placeholder-img {
    width: 300px;
    height: 300px;
    font-size: 6rem;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .placeholder-img {
    width: 240px;
    height: 240px;
    font-size: 5rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .features-header h2 {
    font-size: 2rem;
  }
  .preview-header h2 {
    font-size: 2rem;
  }
  .scroll-top-btn {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
</style>
