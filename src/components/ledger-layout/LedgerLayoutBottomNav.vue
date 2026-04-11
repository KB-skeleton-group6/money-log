<script setup>
import { ref } from 'vue';
import { useLedgerLayoutStore } from '@/stores/ledger';
import { useAddTransactionStore } from '@/stores/transactions/useAddTransactionStore';
import { useRoute } from 'vue-router';

const layoutStore = useLedgerLayoutStore();
const addTransactionStore = useAddTransactionStore();
const route = useRoute();

const emit = defineEmits(['open-quick-add']);

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleDirectAdd = () => {
  addTransactionStore.openModal();
  closeMenu();
};

const handleQuickAdd = () => {
  emit('open-quick-add');
  closeMenu();
};
</script>

<template>
  <nav class="bottom-nav">
    <!-- 오버레이 -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="fab-overlay" @click="closeMenu"></div>
    </transition>

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

    <div class="fab-wrapper">
      <!-- 추가 플로팅 메뉴 -->
      <transition name="fade-slide">
        <div v-if="isMenuOpen" class="fab-menu">
          <button class="fab-item" @click="handleQuickAdd">
            <span>빠른 추가</span>
            <div class="icon-circle quick">
              <i class="fa-solid fa-bolt"></i>
            </div>
          </button>
          <button class="fab-item" @click="handleDirectAdd">
            <span>직접 추가</span>
            <div class="icon-circle direct">
              <i class="fa-solid fa-pen"></i>
            </div>
          </button>
        </div>
      </transition>

      <button
        class="center-fab"
        :class="{ 'is-active': isMenuOpen }"
        @click="toggleMenu"
      >
        <i class="fa-solid fa-plus" :class="{ 'rotate-icon': isMenuOpen }"></i>
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

.fab-wrapper,
.fab-overlay {
  display: none;
}
.center-fab {
  display: none;
}

@media (max-width: 768px) {
  .fab-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
  }

  .fab-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex: 0 0 auto;
    width: 60px;
    z-index: 20;
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
    transition:
      transform 0.3s ease,
      background-color 0.3s ease;
  }

  .center-fab.is-active {
    background-color: #ff5252;
    box-shadow: 0 -4px 12px rgba(255, 82, 82, 0.4);
  }
  .center-fab i {
    transition: transform 0.3s ease;
  }
  .center-fab i.rotate-icon {
    transform: rotate(45deg);
  }

  .fab-menu {
    position: absolute;
    bottom: 100px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
    right: 6px;
  }

  .fab-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .fab-item span {
    background: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    color: #333;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
  }

  .icon-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  .icon-circle:active {
    transform: scale(0.95);
  }
  .icon-circle.quick {
    background-color: #ff9f43;
  }
  .icon-circle.direct {
    background-color: #00bc7c;
  }

  /* 애니메이션 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
