<script setup>
import { useLedgerLayoutStore } from "@/stores/ledger";
import { useRoute } from "vue-router";

const layoutStore = useLedgerLayoutStore();
const route = useRoute();
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="navItem in layoutStore.pages"
      :key="navItem.to.path"
      :to="navItem.to"
      class="nav-item"
      :class="{ active: navItem.to.path === route.path }"
    >
      <i :class="navItem.icon"></i>
      <span>{{ navItem.title }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
}

@media (max-width: 768px) {
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #141e2b;
    border-top: 1px solid #8ea2b739;
    z-index: 100;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex: 1;
  text-decoration: none;
  color: #8ea2b7;
}

.nav-item i {
  font-size: 18px;
}

.nav-item span {
  font-size: 11px;
}

.nav-item.active {
  color: #00c78b;
}
</style>
