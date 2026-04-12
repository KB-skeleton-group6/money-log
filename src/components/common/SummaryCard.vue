<script setup>
import { computed } from 'vue';
import { formatAmount } from '@/utils/formatter';

const props = defineProps({
  title: String,
  amount: Number,
  diff: Number,
  type: String, // 'income', 'expense', 'profit'
});

const displayAmount = computed(() => {
  const absoluteAmount = Math.abs(props.amount);
  return formatAmount(absoluteAmount);
});

const formattedDiff = computed(() => {
  const sign = props.diff > 0 ? '+' : '';
  return `${sign}${props.diff}`;
});

const amountClass = computed(() => {
  if (props.type === 'income') return 'text-blue';
  if (props.type === 'expense') return 'text-red';
  return 'text-green';
});

const diffClass = computed(() => (props.diff >= 0 ? 'up' : 'down'));
</script>

<template>
  <div class="summary-card">
    <div class="card-header">
      <span class="icon-wrapper" :class="type">
        <i v-if="type === 'income'" class="fa-solid fa-arrow-circle-down"></i>
        <i v-else-if="type === 'expense'" class="fa-solid fa-arrow-circle-up"></i>
        <i v-else class="fa-solid fa-check-circle"></i>
      </span>
      <span class="title">{{ title }}</span>
    </div>
    <div class="card-content">
      <h2 :class="amountClass">{{ displayAmount }}원</h2>
      <p class="comparison">
        전월 대비
        <span :class="diffClass">{{ formattedDiff }}%</span>
      </p>
    </div>
    <slot name="chart" />
  </div>
</template>

<style scoped>
.summary-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  flex: 1;
  min-width: 200px;
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-4px);
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 24px;
  flex-shrink: 0;
}
.icon-wrapper.income {
  background: #eff6ff;
  color: #3b82f6;
}
.icon-wrapper.expense {
  background: #fef2f2;
  color: #ef4444;
}
.icon-wrapper.profit {
  background: #f0fdf4;
  color: #10b981;
}

.title {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}

.card-content h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.text-blue {
  color: #3b82f6;
}
.text-red {
  color: #ef4444;
}
.text-green {
  color: #10b981;
}

.comparison {
  font-size: 0.8rem;
  color: #999;
  margin-top: 8px;
}

.up {
  color: #ef4444;
  font-weight: 600;
}
.down {
  color: #3b82f6;
  font-weight: 600;
}

@media (max-width: 768px) {
  .summary-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    min-width: auto;
  }
  .card-header {
    margin-bottom: 0;
  }
  .card-content {
    text-align: right;
    display: flex;
    flex-direction: column-reverse;
  }
  .card-content h2 {
    font-size: 1.25rem;
  }
  .comparison {
    margin-top: 0;
    margin-bottom: 4px;
  }
}
</style>
