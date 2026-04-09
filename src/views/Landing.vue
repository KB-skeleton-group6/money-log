<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const showScrollTop = ref(false);

const handleScroll = () => {
  // 스크롤이 300px 이상 내려가면 버튼 표시
  showScrollTop.value = window.scrollY > 300;
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
    <!-- 네비게이션 바 -->
    <header class="navbar">
      <div class="logo"><i class="fa-solid fa-wallet"></i> Money Log</div>

      <nav class="nav-menu">
        <button @click="scrollToSection('intro')">소개</button>
        <button @click="scrollToSection('features')">핵심 기능</button>
        <button @click="scrollToSection('preview')">실제 화면</button>
      </nav>

      <button class="login-btn">로그인</button>
    </header>

    <!-- 메인 히어로 섹션 -->
    <main id="intro" class="hero-section">
      <div class="hero-content">
        <span class="badge">스마트한 가계부</span>
        <h1 class="title">나만의 체계적인<br />자산 관리 파트너</h1>
        <p class="subtitle">
          직관적인 통계로 소비 패턴을 분석하세요.<br />
          Money Log와 함께 현명한 금융 생활을 시작해 보세요.
        </p>
        <button class="cta-btn">지금 바로 시작하기</button>
      </div>
      <div class="hero-image">
        <div class="placeholder-img">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
      </div>

      <!-- 스크롤 유도 애니메이션 -->
      <div class="scroll-indicator">
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </main>

    <!-- 기능 소개 섹션 -->
    <section id="features" class="features-section">
      <div class="features-header">
        <h2>- 핵심 기능 -</h2>
        <p>복잡한 자산 관리를 쉽고 간편하게 만들어주는 기능을 만나보세요.</p>
      </div>
      <div class="features-grid">
        <!-- Feature 1 -->
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div>
          <h3>한눈에 보는 대시보드</h3>
          <p>수입과 지출 흐름을 달력과 차트로 직관적으로 파악할 수 있습니다.</p>
        </div>
        <!-- Feature 2 -->
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-chart-pie"></i></div>
          <h3>상세한 통계 분석</h3>
          <p>
            카테고리별, 기간별 통계를 통해 나의 소비 패턴을 정확하게 분석합니다.
          </p>
        </div>
        <!-- Feature 3 -->
        <div class="feature-card">
          <div class="feature-icon"><i class="fa-solid fa-list-check"></i></div>
          <h3>간편한 내역 관리</h3>
          <p>언제 어디서나 손쉽게 수입과 지출 내역을 기록하고 관리해보세요.</p>
        </div>
      </div>
    </section>

    <!-- 실제 화면 프리뷰 섹션 -->
    <section id="preview" class="preview-section">
      <div class="preview-header">
        <h2>- 실제 화면 -</h2>
        <p>군더더기 없는 깔끔한 디자인으로 자산 관리에만 집중하세요.</p>
      </div>
      <div class="preview-content">
        <div class="mockup-window">
          <!-- 추후 실제 대시보드 캡처 이미지로 교체할 영역 -->
          <div class="mockup-placeholder">
            <i class="fa-solid fa-laptop-code"></i>
            <p>대시보드 화면 캡처가 들어갈 자리입니다.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 최상단으로 이동 버튼 -->
    <button
      v-if="showScrollTop"
      class="scroll-top-btn"
      @click="scrollToSection('intro')"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* 네비게이션 바 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #20bf6b;
}

/* 중앙 네비게이션 메뉴 */
.nav-menu {
  display: flex;
  gap: 30px;
}
.nav-menu button {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #2f3542;
  cursor: pointer;
  transition: color 0.2s;
}
.nav-menu button:hover {
  color: #20bf6b;
}

.login-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: #2f3542;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.login-btn:hover {
  background-color: #57606f;
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
.mockup-placeholder {
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #f8f9fa, #e0f2fe);
  color: #a4b0be;
}
.mockup-placeholder i {
  font-size: 5rem;
  margin-bottom: 20px;
  color: #70a1ff;
}
.mockup-placeholder p {
  font-size: 1.2rem;
  font-weight: bold;
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
  .navbar {
    padding: 15px 20px;
  }
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
  .nav-menu {
    display: none; /* 모바일 환경에서는 텍스트 메뉴를 임시로 숨김 */
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
  .mockup-placeholder {
    height: 300px;
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
