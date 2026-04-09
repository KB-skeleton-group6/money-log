<script setup></script>

<template>
  <div class="landing-page">
    <!-- 네비게이션 바 -->
    <header class="navbar">
      <div class="logo"><i class="fa-solid fa-wallet"></i> Money Log</div>
      <button class="login-btn">로그인 / 회원가입</button>
    </header>

    <!-- 메인 히어로 섹션 -->
    <main class="hero-section">
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
}
</style>
