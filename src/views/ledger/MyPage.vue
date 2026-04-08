<script setup>
import AuthSettingSection from "@/components/mypage/AccountSection.vue";
import BudgetSection from "@/components/mypage/BudgetSection.vue";
import ProfileSection from "@/components/mypage/ProfileSection.vue";
import { computed, ref } from "vue";

const menuId = ref("profile");

const menuItems = [
  {
    id: "profile",
    label: "프로필",
    icon: "fa-solid fa-user",
    component: ProfileSection,
  },
  {
    id: "budget",
    label: "예산 설정",
    icon: "fa-solid fa-calendar-days",
    component: BudgetSection,
  },
];

const currentComponent = computed(() => {
  return menuItems.find((item) => item.id === menuId.value).component;
});
</script>

<template>
  <div class="container">
    <div class="section-modes">
      <div
        v-for="item in menuItems"
        :key="item.id"
        @click="menuId = item.id"
        :class="menuId === item.id ? 'active' : ''"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="main-section">
      <component :is="currentComponent"></component>
    </div>
    <div class="account-section">
      <AuthSettingSection />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 32px;
  min-width: 600px;
  height: 100%;
  padding: 32px;
  background-color: rgb(240, 240, 240);
}

.section-modes {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  width: 200px;
  padding: 4px;
  border-radius: 10px;
  background-color: white;
}

.section-modes > div {
  flex: 1 1 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #8ea2b7;
  font-size: 12px;
  font-weight: bold;
}

.section-modes > div.active {
  color: white;
  background-color: #00c78b;
}

.account-section {
  flex: 0 0 auto;
}
</style>
