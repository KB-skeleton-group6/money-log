<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import TransactionList from '@/components/transaction/TransactionList.vue';
import TransactionAddModal from '@/components/transaction/TransactionAddModal.vue';
import TransactionFilter from '@/components/transaction/TransactionFilter.vue';
import TransactionSummary from '@/components/transaction/TransactionSummary.vue';
import TransactionPagination from '@/components/transaction/TransactionPagination.vue';

const transactionStore = useTransactionStore();
const { transactions, loading } = storeToRefs(transactionStore);
const { fetchData } = transactionStore;

onMounted(() => {
  fetchData();
});

// 필터 상태
const filters = ref({
  startDate: '',
  endDate: '',
  categoryId: '',
  type: '',
  keyword: '',
});

// 페이지네이션 상태
const currentPage = ref(1);
const itemsPerPage = ref(10);

// 필터 변경 시 페이지 초기화
watch(filters, () => { currentPage.value = 1; }, { deep: true });

// 필터링된 전체 데이터
const allFilteredTransactions = computed(() => {
  if (!transactions.value) return [];

  return transactions.value
    .filter((tx) => {
      const dateObj = new Date(tx.transacted_at);
      const txDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      if (filters.value.startDate && txDate < filters.value.startDate) return false;
      if (filters.value.endDate && txDate > filters.value.endDate) return false;
      if (filters.value.categoryId && tx.category_id !== filters.value.categoryId) return false;
      if (filters.value.type && tx.type !== filters.value.type) return false;
      if (filters.value.keyword) {
        const keyword = filters.value.keyword.toLowerCase();
        if (!tx.detail?.toLowerCase().includes(keyword)) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.transacted_at) - new Date(a.transacted_at));
});

// 현재 페이지 데이터
const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return allFilteredTransactions.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(allFilteredTransactions.value.length / itemsPerPage.value),
);

const summary = computed(() => {
  let income = 0;
  let expense = 0;

  allFilteredTransactions.value.forEach((tx) => {
    if (tx.type === 'INCOME') income += tx.amount;
    if (tx.type === 'EXPENSE') expense += tx.amount;
  });

  return {
    income,
    expense,
    net: income - expense,
    count: allFilteredTransactions.value.length,
  };
});
</script>

<template>
  <div class="page-container">
    <TransactionFilter v-model:filters="filters" />

    <TransactionSummary :summary="summary" />

    <div v-if="loading" class="loading-overlay">
      데이터를 불러오는 중입니다...
    </div>

    <template v-else>
      <TransactionList :transactions="pagedTransactions" />

      <TransactionPagination v-model:currentPage="currentPage" :totalPages="totalPages" />
    </template>

    <TransactionAddModal />
  </div>
</template>

<style scoped>
.page-container {
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
  font-size: 18px;
  font-weight: 700;
  color: #64748b;
}

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
    background-color: #f1f5f9;
    overflow-x: hidden;
  }
}
</style>
