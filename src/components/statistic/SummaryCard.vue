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

// 타입에 따라 금액 색상 변경
const amountClass = computed(() => {
  if (props.type === 'income') return 'text-blue';
  if (props.type === 'expense') return 'text-red';
  return 'text-green'; // profit
});

const diffClass = computed(() => (props.diff >= 0 ? 'up' : 'down'));
</script>

<template>
  <div class="summary-card">
    <div class="card-header">
      <span class="icon-wrapper" :class="type">
        <i v-if="type === 'income'" class="fa-solid fa-arrow-down"></i>
        <i v-else-if="type === 'expense'" class="fa-solid fa-arrow-up"></i>
        <i v-else class="fa-solid fa-arrow-right-arrow-left"></i>
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
  </div>
</template>

<style scoped>
.summary-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
}
.icon-wrapper.income {
  background: #e0f2fe;
  color: #00cfe8;
}
.icon-wrapper.expense {
  background: #fceaea;
  color: #ea5455;
}
.icon-wrapper.profit {
  background: #e6f7ef;
  color: #28c76f;
}

.title {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}

.card-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.text-blue {
  color: #00cfe8;
}
.text-red {
  color: #ea5455;
}
.text-green {
  color: #28c76f;
}

.comparison {
  font-size: 0.8rem;
  color: #999;
  margin-top: 8px;
}

.up {
  color: #ea5455;
  font-weight: 600;
}
.down {
  color: #00cfe8;
  font-weight: 600;
}
</style>
