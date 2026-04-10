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

const activeIndex = computed(() =>
  menuItems.findIndex((item) => item.id === menuId.value)
);
</script>

<template>
  <div class="page-wrapper">
  <div class="container">
    <div class="section-modes">
      <div
        class="slider"
        :style="{ transform: activeIndex === 0 ? 'translateX(0)' : 'translateX(calc(100% + 8px))' }"
      ></div>
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
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100%;
  background-color: #f2f2f7;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 32px;
  min-width: 0;
  max-width: 768px;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
  padding: 32px;
}

.section-modes {
  flex: 0 0 auto;
  position: relative;
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

.slider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 8px);
  background-color: #00c78b;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.section-modes > div:not(.slider) {
  flex: 1 1 80px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #8ea2b7;
  font-size: 12px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.section-modes > div.active {
  color: white;
}

.account-section {
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .container {
    gap: 16px;
    padding: 16px;
  }
}
</style>
