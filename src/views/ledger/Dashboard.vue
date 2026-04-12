<script setup>
import { computed, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { storeToRefs } from 'pinia';

import { useDashboardCalculations } from '@/composables/useDashboardCalculations';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import DashboardSummaryCard from '@/components/dashboard/DashboardSummaryCard.vue';
import RecentTransactionList from '@/components/dashboard/RecentTransactionList.vue';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

onMounted(() => {
  transactionStore.fetchData();
});

const recentTransactions = computed(() => {
  if (!transactions.value?.length) return [];
  return [...transactions.value]
    .sort((a, b) => new Date(b.transacted_at) - new Date(a.transacted_at))
    .slice(0, 7);
});

const {
  netIncome,
  chartDataNet,
  chartDataIncome,
  chartDataExpense,
  netRate,
  incomeRate,
  expenseRate,
  tooltipState,
  chartOptionsNet,
  chartOptionsIncome,
  chartOptionsExpense,
  formatTotalIncome,
  formatTotalExpense,
  formatNetIncome,
} = useDashboardCalculations(transactions);

const netPrefix = computed(() => (netIncome.value > 0 ? '+' : '-'));
</script>

<template>
  <div class="dashboard-container">
    <div class="summary-cards">
      <DashboardSummaryCard
        title="이번 달 수입"
        type="income"
        amountPrefix="+"
        :amount="formatTotalIncome"
        :rate="incomeRate"
        :chartData="chartDataIncome"
        :chartOptions="chartOptionsIncome"
        :tooltipState="tooltipState"
        cardId="income"
      />
      <DashboardSummaryCard
        title="이번 달 지출"
        type="expense"
        amountPrefix="+"
        :amount="formatTotalExpense"
        :rate="expenseRate"
        :chartData="chartDataExpense"
        :chartOptions="chartOptionsExpense"
        :tooltipState="tooltipState"
        cardId="expense"
      />
      <DashboardSummaryCard
        title="이번 달 순이익"
        type="profit"
        :amountPrefix="netPrefix"
        :amount="formatNetIncome"
        :rate="netRate"
        :chartData="chartDataNet"
        :chartOptions="chartOptionsNet"
        :tooltipState="tooltipState"
        cardId="net"
      />
    </div>

    <div class="bottom-section">
      <RecentTransactionList :transactions="recentTransactions" />
      <DashboardCalendar :transactions="transactions" />
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  color: #333;
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media screen and (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  .bottom-section {
    grid-template-columns: 1fr;
  }
}
</style>
