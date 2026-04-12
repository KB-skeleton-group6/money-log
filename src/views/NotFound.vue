<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

const goHome = () => {
  router.push("/");
};

const goPrimary = () => {
  router.push(authStore.isLoggedIn ? "/ledger/dashboard" : "/");
};
</script>

<template>
  <main class="not-found-page">
    <div class="hero-section">
      <div class="hero-content">
        <span class="badge">404 ERROR</span>
        <h1 class="title">찾으시는 페이지가<br />존재하지 않습니다</h1>
        <p class="subtitle">
          주소가 잘못 입력되었거나 페이지가 이동되었을 수 있습니다.<br />
          머니로그 홈 또는 대시보드에서 다시 시작해보세요.
        </p>

        <div class="button-group">
          <button class="cta-btn" @click="goHome">홈으로 이동</button>
          <button
            v-if="authStore.isLoggedIn"
            class="secondary-btn"
            @click="router.push('/ledger/dashboard')"
          >
            대시보드로 이동
          </button>
          <button
            v-else
            class="secondary-btn"
            @click="goPrimary"
          >
            로그인하기
          </button>
        </div>
      </div>

      <div class="hero-image">
        <div class="placeholder-img">
          <div class="error-code">404</div>
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found-page {
  flex: 1;
  display: flex;
}

.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 60px;
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

.button-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-btn,
.secondary-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s,
    border-color 0.2s;
}

.cta-btn {
  background-color: #20bf6b;
  color: white;
}

.cta-btn:hover {
  background-color: #1da35b;
  transform: translateY(-2px);
}

.secondary-btn {
  background: white;
  color: #2f3542;
  border: 1px solid #dfe4ea;
}

.secondary-btn:hover {
  border-color: #20bf6b;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.placeholder-img {
  position: relative;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #e0f2fe 0%, #e6f7ef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  color: #28c76f;
}

.placeholder-img i {
  font-size: 6.5rem;
}

.error-code {
  position: absolute;
  top: 78px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3.4rem;
  font-weight: 800;
  color: #2f3542;
  letter-spacing: 0.08em;
}

@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }

  .button-group {
    justify-content: center;
  }

  .placeholder-img {
    width: 300px;
    height: 300px;
  }

  .placeholder-img i {
    font-size: 5rem;
  }

  .error-code {
    top: 56px;
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  .cta-btn,
  .secondary-btn {
    width: 100%;
  }

  .placeholder-img {
    width: 240px;
    height: 240px;
  }

  .placeholder-img i {
    font-size: 4rem;
  }

  .error-code {
    top: 44px;
    font-size: 2.2rem;
  }
}
</style>
