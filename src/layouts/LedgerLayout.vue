<script setup>
import LedgerLayoutHeader from '@/components/ledger-layout/LedgerLayoutHeader.vue';
import LedgerLayoutSidebar from '@/components/ledger-layout/LedgerLayoutSidebar.vue';
import LedgerLayoutBottomNav from '@/components/ledger-layout/LedgerLayoutBottomNav.vue';

import TransactionAddModal from '@/components/transaction/TransactionAddModal.vue';
import TransactionQuickAddModal from '@/components/transaction/TransactionQuickAddModal.vue';
import { useAddTransactionStore } from '@/stores/transactions/useAddTransactionStore';
import { useLedgerLayoutStore } from '@/stores/ledger';

const layoutStore = useLedgerLayoutStore();

const openStandardModal = () => {
  useAddTransactionStore().openModal();
  layoutStore.closeFab();
};
</script>

<template>
  <div class="layout">
    <LedgerLayoutSidebar />
    <div class="content">
      <LedgerLayoutHeader />
      <div class="body">
        <router-view></router-view>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="layoutStore.isFabOpen"
        class="fab-overlay"
        @click="layoutStore.closeFab()"
      ></div>
    </transition>

    <div class="fab-container">
      <transition name="fade-up">
        <div v-if="layoutStore.isFabOpen" class="fab-actions">
          <button class="fab-action-btn" @click="layoutStore.openQuickAdd()">
            <span class="fab-tooltip">빠른 추가</span>
            <div class="fab-icon"><i class="fa-solid fa-bolt"></i></div>
          </button>
          <button class="fab-action-btn" @click="openStandardModal">
            <span class="fab-tooltip">직접 추가</span>
            <div class="fab-icon"><i class="fa-solid fa-pen"></i></div>
          </button>
        </div>
      </transition>
      <button
        class="add-transaction-btn"
        :class="{ open: layoutStore.isFabOpen }"
        @click="layoutStore.toggleFab()"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>

  <LedgerLayoutBottomNav />
  <TransactionAddModal />

  <TransactionQuickAddModal
    :is-open="layoutStore.isQuickAddOpen"
    @close="layoutStore.closeQuickAdd()"
  />
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
  height: 100vh;
}

.content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: start;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: scroll;
}

.fab-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 999;
}

.fab-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-end;
}

.fab-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 8px;
}

.fab-tooltip {
  background: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.fab-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  color: #00bc7c;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.fab-action-btn:hover .fab-icon {
  transform: scale(1.1);
}

.add-transaction-btn {
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 50%;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  background-color: #00bc7c;
  color: white;
  cursor: pointer;
  font-size: 24px;
}

.add-transaction-btn.open {
  transform: rotate(45deg);
  background-color: #ff4757;
}

/* 오버레이 스타일 */
.fab-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

/* Vue Transition (오버레이 페이드 효과) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Vue Transition (페이드 업 효과) */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .fab-container {
    display: none;
  }

  .fab-overlay {
    display: none;
  }

  .body {
    padding-bottom: 60px;
  }
}
</style>
