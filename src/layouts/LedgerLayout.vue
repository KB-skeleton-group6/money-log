<script setup>
import LedgerLayoutHeader from "@/components/ledger-layout/LedgerLayoutHeader.vue";
import LedgerLayoutSidebar from "@/components/ledger-layout/LedgerLayoutSidebar.vue";
import LedgerLayoutBottomNav from "@/components/ledger-layout/LedgerLayoutBottomNav.vue";

import TransectionAddModal from "@/components/transection/TransectionAddModal.vue";
import { useAddTransactionStore } from "@/stores/transactions/useAddTransactionStore";
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
    <button class="add-transaction-btn" @click="useAddTransactionStore().openModal">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>

  <LedgerLayoutBottomNav />
  <TransectionAddModal />
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

.add-transaction-btn {
  position: fixed;
  width: 64px;
  height: 64px;
  bottom: 32px;
  right: 32px;
  border: none;
  border-radius: 50%;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: background-color 0.3s ease;
  background-color: #00bc7c;
}

@media (max-width: 768px) {
  .add-transaction-btn {
    bottom: 76px;
    right: 16px;
  }
}
</style>
