<script setup>
import { useLedgerLayoutStore } from "@/stores/ledger";
import { useAddTransactionStore } from "@/stores/transactions/useAddTransactionStore";
import { useRoute } from "vue-router";

const layoutStore = useLedgerLayoutStore();
const addTransactionStore = useAddTransactionStore();
const route = useRoute();

const handleStandardAdd = () => {
  addTransactionStore.openModal();
  layoutStore.closeFab();
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="layoutStore.isFabOpen"
      class="mob-overlay"
      @click="layoutStore.closeFab()"
    ></div>
  </transition>

  <nav class="bottom-nav">
    <router-link
      v-for="navItem in layoutStore.pages.slice(0, 2)"
      :key="navItem.to.path"
      :to="navItem.to"
      class="nav-item"
      :class="{ active: navItem.to.path === route.path }"
    >
      <i :class="navItem.icon"></i>
      <span>{{ navItem.title }}</span>
    </router-link>

    <div class="center-fab-wrap">
      <transition name="fade-up">
        <div v-if="layoutStore.isFabOpen" class="mob-fab-actions">
          <button class="mob-action-btn" @click="layoutStore.openQuickAdd()">
            <div class="mob-fab-icon"><i class="fa-solid fa-bolt"></i></div>
            <span>빠른 추가</span>
          </button>
          <button class="mob-action-btn" @click="handleStandardAdd">
            <div class="mob-fab-icon"><i class="fa-solid fa-pen"></i></div>
            <span>직접 추가</span>
          </button>
        </div>
      </transition>
      <button
        class="center-fab"
        :class="{ open: layoutStore.isFabOpen }"
        @click="layoutStore.toggleFab()"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>

    <router-link
      v-for="navItem in layoutStore.pages.slice(2)"
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
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #141e2b;
    border-top: 1px solid #8ea2b739;
    z-index: 100;
    overflow: visible;
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

.center-fab-wrap {
  display: none;
}

@media (max-width: 768px) {
  .mob-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .center-fab-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    position: relative;
  }

  .center-fab {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #00bc7c;
    box-shadow: 0 -4px 12px rgba(0, 188, 124, 0.4);
    color: white;
    font-size: 20px;
    cursor: pointer;
    transform: translateY(-30px);
    transition: background-color 0.3s ease, transform 0.3s ease;
    border: none;
  }

  .center-fab.open {
    background-color: #ff4757;
    transform: translateY(-30px) rotate(45deg);
  }

  .mob-fab-actions {
    position: absolute;
    bottom: calc(100% + 48px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    z-index: 101;
  }

  .mob-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: white;
  }

  .mob-fab-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: white;
    color: #00bc7c;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .mob-action-btn span {
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: all 0.25s ease;
  }
  .fade-up-enter-from,
  .fade-up-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}
</style>
