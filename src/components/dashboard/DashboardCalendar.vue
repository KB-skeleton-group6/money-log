<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/formatter';

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});

const baseDate = ref(dayjs('2026-04-01'));
const currentYear = computed(() => baseDate.value.year());
const currentMonth = computed(() => baseDate.value.month() + 1);

const prevMonth = () => { baseDate.value = baseDate.value.subtract(1, 'month'); };
const nextMonth = () => { baseDate.value = baseDate.value.add(1, 'month'); };

const calendarDays = computed(() => {
  const startDate = baseDate.value.startOf('month').startOf('week');
  return Array.from({ length: 42 }).map((_, index) => {
    const targetDate = startDate.add(index, 'day');
    const dateStr = targetDate.format('YYYY-MM-DD');
    const dayTx = props.transactions.filter((t) => t.transacted_at.startsWith(dateStr));
    return {
      date: dateStr,
      dayNumber: targetDate.date(),
      isCurrentMonth: targetDate.month() === baseDate.value.month(),
      hasIncome: dayTx.some((t) => t.type === 'INCOME'),
      hasExpense: dayTx.some((t) => t.type === 'EXPENSE'),
      transactions: dayTx,
    };
  });
});

const isToday = (dateStr) => dateStr === dayjs().format('YYYY-MM-DD');
</script>

<template>
  <div class="card calendar-card">
    <div class="calendar-header">
      <button @click="prevMonth">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h3>{{ currentYear }}년 {{ currentMonth }}월</h3>
      <button @click="nextMonth">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
    <div class="calendar-grid">
      <div class="weekday text-red">일</div>
      <div class="weekday">월</div>
      <div class="weekday">화</div>
      <div class="weekday">수</div>
      <div class="weekday">목</div>
      <div class="weekday">금</div>
      <div class="weekday text-blue">토</div>
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="day-cell"
        :class="{
          'is-today': isToday(day.date),
          'other-month': !day.isCurrentMonth,
        }"
      >
        <span class="day-number">{{ day.dayNumber }}</span>
        <div class="dots">
          <span v-if="day.hasIncome" class="dot dot-blue"></span>
          <span v-if="day.hasExpense" class="dot dot-red"></span>
        </div>
        <div v-if="day.transactions.length > 0" class="day-tooltip">
          <div
            v-for="tx in day.transactions"
            :key="tx.id"
            class="tooltip-tx"
          >
            <span>{{ tx.detail }}</span>
            <span :class="tx.type === 'INCOME' ? 'text-blue' : 'text-red'">
              {{ tx.type === 'INCOME' ? '+' : '' }}{{ formatCurrency(tx.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="calendar-legend">
      <span class="legend-item"><span class="dot dot-blue"></span> 수입</span>
      <span class="legend-item"><span class="dot dot-red"></span> 지출</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.calendar-header button {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
}
.weekday {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}
.day-cell {
  position: relative;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.day-cell:hover {
  background-color: #f1f3f5;
}
.other-month {
  opacity: 0.3;
}
.is-today .day-number {
  background-color: #e6f7ef;
  color: #28c76f;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.dots {
  display: flex;
  gap: 3px;
  margin-top: 5px;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}
.dot-blue { background-color: #00cfe8; }
.dot-red  { background-color: #ea5455; }
.day-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
  font-size: 0.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}
.day-cell:hover .day-tooltip {
  display: block;
}
.tooltip-tx {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 4px;
}
.tooltip-tx:last-child {
  margin-bottom: 0;
}
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #666;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.text-red  { color: #ea5455; }
.text-blue { color: #00cfe8; }
</style>
