<script setup>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { storeToRefs } from "pinia";

import {
  formatCurrency,
  formatDateTime,
  useDashboardCalculations,
} from "../../utils/dataChart";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Categories } from "../../constant/categories";
import { formatDate } from "@/utils/formatter";


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const allList = Object.values(Categories);


const recentTransaction = computed(() => {
  if (!transactionStore.transactions || transactionStore.transactions.length === 0) {
    return [];
  }

  return [...transactionStore.transactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 7);
});

onMounted(() => {
  transactionStore.fetchData();
});

const {
  totalIncome,
  totalExpense,
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
} = useDashboardCalculations(transactions);

const baseDate = ref(dayjs("2026-04-01"));
const currentYear = computed(() => baseDate.value.year());
const currentMonth = computed(() => baseDate.value.month() + 1);

const prevMonth = () => {
  baseDate.value = baseDate.value.subtract(1, "month");
};
const nextMonth = () => {
  baseDate.value = baseDate.value.add(1, "month");
};

const calendarDays = computed(() => {
  const startDate = baseDate.value.startOf("month").startOf("week");
  return Array.from({ length: 42 }).map((_, index) => {
    const targetDate = startDate.add(index, "day");
    const dateStr = targetDate.format("YYYY-MM-DD");
    const dayTx = transactions.value.filter((t) =>
      t.transacted_at.startsWith(dateStr),
    );
    return {
      date: dateStr,
      dayNumber: targetDate.date(),
      isCurrentMonth: targetDate.month() === baseDate.value.month(),
      hasIncome: dayTx.some((t) => t.type === "INCOME"),
      hasExpense: dayTx.some((t) => t.type === "EXPENSE"),
      transactions: dayTx,
    };
  });
});

const isToday = (dateStr) => dateStr === dayjs().format("YYYY-MM-DD");
</script>

<template>
  <div class="dashboard-container">
    <div class="summary-cards">
      <div class="card summary-card">
        <div class="card-header">
          <span>순이익</span>
          <i class="fa-solid fa-arrow-right-arrow-left icon-bg text-green"></i>
        </div>
        <div class="card-body">
          <h2 class="text-green">
            {{ netIncome > 0 ? "+" : "" }}{{ formatCurrency(netIncome) }}원
          </h2>
          <p class="change-rate text-green">
            <i class="fa-solid" :class="netRate.icon"></i>{{ netRate.text }}
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataNet" :options="chartOptionsNet" />
          <div
            v-if="tooltipState.show && tooltipState.activeId === 'net'"
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

      <div class="card summary-card">
        <div class="card-header">
          <span>이번 달 수입</span>
          <i class="fa-solid fa-arrow-down icon-bg text-blue"></i>
        </div>
        <div class="card-body">
          <h2 class="text-blue">+{{ formatCurrency(totalIncome) }}원</h2>
          <p class="change-rate text-blue">
            <i class="fa-solid" :class="incomeRate.icon"></i
            >{{ incomeRate.text }}
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataIncome" :options="chartOptionsIncome" />
          <div
            v-if="tooltipState.show && tooltipState.activeId === 'income'"
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

      <div class="card summary-card">
        <div class="card-header">
          <span>이번 달 지출</span>
          <i class="fa-solid fa-arrow-up icon-bg text-red"></i>
        </div>
        <div class="card-body">
          <h2 class="text-red">{{ formatCurrency(totalExpense) }}원</h2>
          <p class="change-rate text-red">
            <i class="fa-solid" :class="expenseRate.icon"></i
            >{{ expenseRate.text }}
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataExpense" :options="chartOptionsExpense" />
          <div
            v-if="tooltipState.show && tooltipState.activeId === 'expense'"
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
    </div>

    <div class="bottom-section">
      <div class="card transaction-list-card">
        <div class="card-header border-bottom">
          <h3>최근 거래내역</h3>
          <RouterLink to="/ledger/transactions">
            <a class="view-all">전체보기 ></a>
          </RouterLink>
        </div>
        <ul class="transaction-list">
          <li
            v-for="item in recentTransactions"
            :key="item.id"
            class="transaction-item"
          >
            <div
              class="icon-wrapper"
              :style="{
                backgroundColor: allList.find(
                  (cat) => cat.id === item.category_id,
                ).subColor,
                color: allList.find((cat) => cat.id === item.category_id).color,
              }"
            >
              <i
                :class="allList.find((cat) => cat.id === item.category_id).icon"
              ></i>
            </div>
            <div class="item-info">
              <h4>{{ item.detail }}</h4>
              <p>거래: {{ formatDate(item.transacted_at) }}</p>
              <p>생성: {{ formatDateTime(item.created_at) }}</p>
            </div>
            <div
              class="item-amount"
              :class="item.type === 'INCOME' ? 'text-blue' : 'text-red'"
            >
              {{ item.type === "INCOME" ? "+" : ""
              }}{{ formatCurrency(item.amount) }}원
            </div>
          </li>
        </ul>
      </div>

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
                  {{ tx.type === "INCOME" ? "+" : ""
                  }}{{ formatCurrency(tx.amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="calendar-legend">
          <span class="legend-item"
            ><span class="dot dot-blue"></span> 수입</span
          >
          <span class="legend-item"
            ><span class="dot dot-red"></span> 지출</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 및 폰트 */
.dashboard-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  color: #333;
}
.text-green {
  color: #28c76f;
}
.text-blue {
  color: #00cfe8;
}
.text-red {
  color: #ea5455;
}

/* 카드 공통 스타일 */
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.summary-card {
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}
.icon-bg {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f3f5;
  font-size: 0.9rem;
}
.card-body h2 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
}
.change-rate {
  font-size: 0.85rem;
  margin: 0;
}

.chart-container {
  position: relative; /* 툴팁이 이 박스를 기준으로 뜨도록 설정 */
  height: 40px;
  margin-top: auto;
  padding-top: 15px;
}

.custom-tooltip {
  position: absolute;
  background-color: #333333;
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

/* 하단 영역 그리드 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

/* 강제 밑줄 제거용 철벽 CSS */
a.view-all {
  text-decoration: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  color: #666 !important;
  font-size: 0.9rem;
}
a.view-all:visited,
a.view-all:active {
  text-decoration: none !important;
  border-bottom: none !important;
  color: #666 !important;
}
a.view-all:hover {
  text-decoration: none !important;
  color: #28c76f !important;
}

/* 리스트 아이템 */
.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.transaction-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
}
.icon-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 15px;
}
.item-info {
  flex: 1;
}
.item-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
}
.item-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
}
.item-amount {
  font-weight: 600;
}

/* 달력 디자인 */
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
.dot-blue {
  background-color: #00cfe8;
}
.dot-red {
  background-color: #ea5455;
}

/* 달력 툴팁 */
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
</style>
