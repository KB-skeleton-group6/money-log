<script setup>
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useLedgerLayoutStore } from "@/stores/ledger";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const layoutStore = useLedgerLayoutStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const title = computed(() => layoutStore.currentPage.title);
const desc = computed(() => {
  if (route.path === "/ledger/dashboard") {
    return new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }
  return layoutStore.currentPage.desc;
});

const userName = computed(() => {
  return authStore.user?.name ?? "";
});

const isDropdownOpen = ref(false);

function toggleDropdown() {
  if (window.innerWidth <= 768) {
    router.push("/ledger/mypage");
    return;
  }
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

async function logout() {
  authStore.logout();
  router.push("/");
  closeDropdown();
}
</script>

<template>
  <div class="ledger-layout-header">
    <div class="mobile-logo">
      <i class="fa-solid fa-wallet"></i>
    </div>
    <div class="header-left">
      <div class="title">{{ title }}</div>
      <div class="desc">{{ desc }}</div>
    </div>
    <div class="header-right">
      <div class="alarm">
        <i class="fa-regular fa-bell"></i>
      </div>
      <div class="profile" @click.stop="toggleDropdown">
        <div class="avatar">
          <i class="fa-regular fa-user"></i>
        </div>
        <span>{{ userName }}</span>
        <div v-if="isDropdownOpen" class="profile-dropdown">
          <button class="dropdown-item" @click="logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="isDropdownOpen"
      class="dropdown-overlay"
      @click="closeDropdown"
    />
  </div>
</template>

<style scoped>
.ledger-layout-header {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 16px;
}

.header-left {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
}

.header-left .title {
  font-size: 20px;
  font-weight: bold;
}

.header-left .desc {
  font-size: 14px;
  color: #8ea2b7;
}

.header-right {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 24px;
  padding: 0 8px;
}

.header-right .profile {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.header-right .profile .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #00c78b;
  background-color: #00c78b64;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right .profile span {
  font-size: 14px;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 18px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: #374151;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item i {
  font-size: 14px;
  color: #6b7280;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.mobile-logo {
  display: none;
}

@media (max-width: 768px) {
  .ledger-layout-header {
    padding: 12px 16px;
  }

  .header-left .title {
    font-size: 20px;
  }

  .header-left .desc {
    display: none;
  }

  .mobile-logo {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    margin-right: 8px;
    font-size: 18px;
  }

  .mobile-logo img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}
</style>
