<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { formatCurrency } from '@/utils/formatter';

const props = defineProps({
  title: String,
  type: String, // 'income' | 'expense' | 'profit'
  amountPrefix: String,
  amount: String,
  rate: Object,
  chartData: Object,
  chartOptions: Object,
  tooltipState: Object,
  cardId: String,
});

const typeConfig = computed(() => {
  const configs = {
    income:  { icon: 'fa-arrow-circle-down',  bg: '#eff6ff', color: '#3b82f6' },
    expense: { icon: 'fa-arrow-circle-up',    bg: '#fef2f2', color: '#ef4444' },
    profit:  { icon: 'fa-check-circle',       bg: '#f0fdf4', color: '#10b981' },
  };
  return configs[props.type] ?? configs.profit;
});
</script>

<template>
  <div class="card summary-card">
    <div class="card-header">
      <span
        class="icon-wrapper"
        :style="{ backgroundColor: typeConfig.bg, color: typeConfig.color }"
      >
        <i class="fa-solid" :class="typeConfig.icon"></i>
      </span>
      <span class="title">{{ title }}</span>
    </div>
    <div class="card-body">
      <h2 :style="{ color: typeConfig.color }">{{ amountPrefix }}{{ amount }}</h2>
      <p class="change-rate">
        <i class="fa-solid" :class="rate.icon"></i>{{ rate.text }}
      </p>
    </div>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
      <div
        v-if="tooltipState.show && tooltipState.activeId === cardId"
        class="custom-tooltip"
        :style="{ left: tooltipState.x + 'px', top: tooltipState.y + 'px' }"
      >
        <div class="tooltip-month">{{ tooltipState.month }}</div>
        <div class="tooltip-data">
          거래 {{ tooltipState.count }}건 :
          {{ formatCurrency(tooltipState.value) }}원
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-4px);
}
.summary-card {
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
.title {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}
.card-body h2 {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 800;
}
.change-rate {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}
.chart-container {
  position: relative;
  height: 40px;
  margin-top: auto;
  padding-top: 15px;
}
.custom-tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  z-index: 100;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
.tooltip-month {
  font-size: 12px;
  margin-bottom: 2px;
}
.tooltip-data {
  font-size: 13px;
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }
  .card-header {
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .card-body {
    text-align: right;
    display: flex;
    flex-direction: column-reverse;
  }
  .card-body h2 {
    font-size: 1.25rem;
  }
  .change-rate {
    margin-bottom: 4px;
  }
  .chart-container {
    display: none;
  }
}
</style>
