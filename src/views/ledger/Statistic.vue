<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { storeToRefs } from 'pinia';

import CategoryChart from '@/components/statistic/CategoryChart.vue';
import MainChart from '@/components/statistic/MainChart.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import TopCategoryList from '@/components/statistic/TopCategoryList.vue';

const store = useTransactionStore();
const { transactions, categories, summaryStats, loading } = storeToRefs(store);

const filters = [
  { label: '주간별', value: 'weekly' },
  { label: '월별', value: 'monthly' },
  { label: '분기별', value: 'quarterly' },
  { label: '연도별', value: 'yearly' },
];

const currentFilter = ref('monthly');
const currentType = ref('expense');

onMounted(() => {
  store.fetchData();
});

watch(currentFilter, (newVal) => {
  console.log(`${newVal} 필터 적용`);
});
</script>

<template>
  <div class="statistics-page">
    <div v-if="loading" class="loading-overlay">데이터를 분석 중입니다...</div>

    <div v-else class="content-wrapper">
      <section class="summary-container">
        <SummaryCard
          title="이번 달 수입"
          :amount="summaryStats.totalIncome"
          :diff="Number(summaryStats.incomeDiff)"
          type="income"
        />
        <SummaryCard
          title="이번 달 지출"
          :amount="summaryStats.totalExpense"
          :diff="Number(summaryStats.expenseDiff)"
          type="expense"
        />
        <SummaryCard
          title="이번 달 순이익"
          :amount="summaryStats.totalProfit"
          :diff="Number(summaryStats.profitDiff)"
          type="profit"
        />
      </section>

      <section class="filter-container">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-btn', { active: currentFilter === filter.value }]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </section>

      <MainChart :filter-type="currentFilter" />

      <div class="category-toggle-wrapper">
        <button
          :class="['toggle-btn', { active: currentType === 'expense' }]"
          @click="currentType = 'expense'"
        >
          지출 카테고리
        </button>
        <button
          :class="['toggle-btn', { active: currentType === 'income' }]"
          @click="currentType = 'income'"
        >
          수입 카테고리
        </button>
      </div>

      <section class="bottom-container">
        <CategoryChart :active-type="currentType" />
        <TopCategoryList :active-type="currentType" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.statistics-page {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.summary-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 30px;
}

.main-content-card {
  background: white;
  border-radius: 15px;
  padding: 10px; /* 내부 여백 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

/* 필터 버튼 스타일 */
.filter-container {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #eee;
  background-color: white;
  color: #888;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background-color: #28c76f;
  color: white;
  border-color: #28c76f;
  font-weight: bold;
}

.filter-btn:hover:not(.active) {
  background-color: #f0f0f0;
}

.category-toggle-wrapper {
  display: flex;
  gap: 12px;
  margin: 30px 0 20px 0;
}

.toggle-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #f1f2f6;
  color: #747d8c;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #ea5455;
  color: white;
}

.toggle-btn:nth-child(2).active {
  background: #00cfe8;
}

.bottom-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
  margin-top: 20px;
}

.bottom-container > * {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-section,
.top-category-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 반응형 최적화 (태블릿 & 모바일) */
@media (max-width: 992px) {
  .bottom-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 12px;
  }

  .summary-container {
    flex-direction: column;
    gap: 12px;
  }

  .filter-container {
    flex-wrap: wrap;
  }
}
</style>
