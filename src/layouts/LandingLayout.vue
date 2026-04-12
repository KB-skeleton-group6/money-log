<script setup>
import { nextTick, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthModal from "@/components/auth/AuthModal.vue";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showAuthModal = ref(false);
const openAuthModal = () => {
  showAuthModal.value = true;
};

const navItems = [
  { id: "intro", label: "소개" },
  { id: "features", label: "핵심 기능" },
  { id: "preview", label: "실제 화면" },
];

const scrollToSection = (sectionId) => {
  if (route.name !== "Home") {
    router.push({ name: "Home", hash: `#${sectionId}` });
    return;
  }

  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const handlePrimaryAction = () => {
  if (authStore.isLoggedIn) {
    router.push("/ledger/dashboard");
    return;
  }

  showAuthModal.value = true;
};

const scrollToHash = async (hash) => {
  if (!hash) return;

  await nextTick();
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

provide("openAuthModal", openAuthModal);

watch(
  () => route.hash,
  (hash) => {
    scrollToHash(hash);
  },
  { immediate: true },
);
</script>

<template>
  <div class="landing-layout">
    <header class="navbar">
      <button class="logo" @click="router.push('/')">
        <i class="fa-solid fa-wallet"></i>머니로그
      </button>

      <nav v-if="route.name === 'Home'" class="nav-menu">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <button class="login-btn" @click="handlePrimaryAction">
        {{ authStore.isLoggedIn ? "대시보드" : "로그인" }}
      </button>
    </header>

    <router-view />

    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<style scoped>
.landing-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  gap: 24px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: none;
  font-size: 1.5rem;
  font-weight: 800;
  color: #20bf6b;
  cursor: pointer;
  flex-shrink: 0;
}

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
  flex-shrink: 0;
}

.login-btn:hover {
  background-color: #57606f;
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
    gap: 16px;
  }

  .nav-menu {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 14px 16px;
  }

  .logo {
    font-size: 1.25rem;
  }

  .login-btn {
    padding: 9px 14px;
    font-size: 0.95rem;
  }
}
</style>
