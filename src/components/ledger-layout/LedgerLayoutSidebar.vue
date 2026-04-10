<script setup>
import { useLedgerLayoutStore } from "@/stores/ledger";
import { computed } from "vue";
import { useRoute } from "vue-router";

const layoutStore = useLedgerLayoutStore();

const route = useRoute();

const open = computed(() => layoutStore.menuOpen);

const sidebarClass = computed(() => {
  return {
    open: open.value,
  };
});

const toggleSidebar = () => {
  layoutStore.toggleMenu();
};
</script>

<template>
  <div class="sidebar" :class="sidebarClass">
    <router-link to="/" class="header">
      <img alt="" />
      <span class="sidebar-label">머니로그</span>
    </router-link>
    <div class="nav-bar">
      <div
        class="nav-item"
        :class="navItem.to.path === route.path ? 'active' : ''"
        v-for="navItem in layoutStore.pages"
        :key="navItem.id"
      >
        <router-link :to="navItem.to">
          <i :class="navItem.icon"></i
          ><span class="sidebar-label">{{ navItem.title }}</span>
        </router-link>
      </div>
    </div>
    <div class="toggle-sidebar-box" @click="toggleSidebar">
      <i
        :class="!open ? 'fa-solid fa-angle-left' : 'fa-solid fa-angle-right'"
      ></i>
      <button class="sidebar-label toggle-sidebar-text">접기</button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  width: 240px;
  border-right: 1px solid lightgray;
  background-color: #141e2b;
  overflow: hidden;
  transition: width 0.3s ease;
}

.sidebar.open {
  width: 64px;
}

.header {
  text-decoration: none;
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  line-height: 1;
  gap: 16px;
  height: 56px;
  padding: 8px;
  color: white;
}

.header > img {
  flex: 0 0 auto;
  display: block;
  width: 40px;
  height: 40px;
}

.header > span {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.sidebar.open .header,
.sidebar.open .nav-item a,
.sidebar.open .toggle-sidebar-box {
  justify-content: center;
  gap: 0;
}

.sidebar-label {
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  transition: opacity 0.2s ease 0.15s;
}

.sidebar.open .sidebar-label {
  flex: 0 0 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.nav-bar {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  gap: 4px;
  padding: 8px;
  border-top: 1px solid #8ea2b739;
  border-bottom: 1px solid #8ea2b739;
}

.nav-item {
  flex: 0 0 auto;
  height: 48px;
  padding: 8px;
  border-radius: 16px;
}

.nav-item * {
  text-decoration: none;
  color: #8ea2b7;
}

.nav-item a {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.nav-item i {
  flex: 0 0 32px;
  text-align: center;
}

.nav-item span {
  flex: 1 1 auto;
}

.nav-item.active {
  background-color: #00bc7d40;
}

.nav-item.active * {
  color: #00c78b;
}

.toggle-sidebar-box {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-sidebar-box * {
  color: #8ea2b7;
}

.toggle-sidebar-text {
  background: none;
  border: none;
  padding: 0;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
