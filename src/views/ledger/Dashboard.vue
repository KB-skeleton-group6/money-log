<script setup>
import { computed, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import { Calendar } from "v-calendar";
import "v-calendar/style.css";
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
  const txs = transactionStore.transactions;
  if (!txs || txs.length === 0) return [];

  return [...txs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
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
  formatTotalIncome,
  formatTotalExpense,
  formatNetIncome,
} = useDashboardCalculations(transactions);

const summaryCards = computed(() => [
  {
    id: "net",
    title: "총 순이익",
    icon: "fa-arrow-right-arrow-left",
    color: "green",
    amountText: `${netIncome.value > 0 ? "+" : netIncome.value < 0 ? "-" : ""}${formatNetIncome.value}`,
    rate: netRate.value,
    chartData: chartDataNet.value,
    chartOptions: chartOptionsNet.value,
  },
  {
    id: "income",
    title: "이번 달 수입",
    icon: "fa-arrow-down",
    color: "blue",
    amountText: `+${formatTotalIncome.value}`,
    rate: incomeRate.value,
    chartData: chartDataIncome.value,
    chartOptions: chartOptionsIncome.value,
  },
  {
    id: "expense",
    title: "이번 달 지출",
    icon: "fa-arrow-up",
    color: "red",
    amountText: `+${formatTotalExpense.value}`,
    rate: expenseRate.value,
    chartData: chartDataExpense.value,
    chartOptions: chartOptionsExpense.value,
  },
]);

const attributes = computed(() => {
  if (!transactions.value) return [];

  const grouped = {};

  transactions.value.forEach((tx) => {
    const dateStr = tx.transacted_at.substring(0, 10);
    const dayNum = new Date(dateStr).getDate();

    if (!grouped[dateStr]) {
      grouped[dateStr] = {
        date: new Date(dateStr),
        dayNum: dayNum,
        incomeCount: 0,
        incomeTotal: 0,
        expenseCount: 0,
        expenseTotal: 0,
      };
    }

    if (tx.type === "INCOME") {
      grouped[dateStr].incomeCount++;
      grouped[dateStr].incomeTotal += tx.amount;
    } else if (tx.type === "EXPENSE") {
      grouped[dateStr].expenseCount++;
      grouped[dateStr].expenseTotal += tx.amount;
    }
  });

  return Object.entries(grouped).map(([dateStr, data]) => {
    const netAmount = data.incomeTotal - data.expenseTotal;
    let dotColor = "gray";

    if (data.incomeCount > 0 && data.expenseCount > 0) dotColor = "purple";
    else if (data.incomeCount > 0) dotColor = "blue";
    else if (data.expenseCount > 0) dotColor = "red";

    return {
      key: dateStr,
      dates: data.date,
      dot: { color: dotColor },
      customData: {
        ...data,
        netAmount,
      },
      popover: {
        visibility: "hover",
        hideIndicator: true,
      },
    };
  });
});
</script>

<template>
  <div class="dashboard-container">
    <div class="summary-cards">
      <div class="card summary-card">
        <div class="card-header">
          <span>총 순이익</span>
          <i class="fa-solid fa-arrow-right-arrow-left icon-bg text-green"></i>
        </div>
        <div class="card-body">
          <h2 class="text-green">
            {{ netIncome > 0 ? "+" : "-" }}{{ formatNetIncome }}
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
          <h2 class="text-blue">+{{ formatTotalIncome }}</h2>
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
          <h2 class="text-red">+{{ formatTotalExpense }}</h2>
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
          <RouterLink to="/ledger/transactions" class="view-all"
            >전체보기 ></RouterLink
          >
        </div>
        <ul class="transaction-list">
          <li
            v-for="item in recentTransaction"
            :key="item.id"
            class="transaction-item"
          >
            <div
              class="icon-wrapper"
              :style="{
                backgroundColor: allList.find(
                  (cat) => cat.id === item.category_id,
                )?.subColor,
                color: allList.find((cat) => cat.id === item.category_id)
                  ?.color,
              }"
            >
              <i
                :class="
                  allList.find((cat) => cat.id === item.category_id)?.icon
                "
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
        <Calendar
          class="custom-calendar"
          :attributes="attributes"
          expanded
          borderless
          transparent
        >
          <template #day-popover="{ attributes }">
            <div
              v-for="attr in attributes.filter((a) => a.customData)"
              :key="attr.key"
              class="custom-popover"
            >
              <div class="popover-header">{{ attr.customData.dayNum }}일</div>

              <div v-if="attr.customData.incomeCount > 0" class="popover-row">
                <span class="label">
                  <span class="dot-icon dot-blue"></span> 수입
                  {{ attr.customData.incomeCount }}건
                </span>
                <span class="amount text-blue">
                  +{{ formatCurrency(attr.customData.incomeTotal) }}원
                </span>
              </div>

              <div v-if="attr.customData.expenseCount > 0" class="popover-row">
                <span class="label">
                  <span class="dot-icon dot-red"></span> 지출
                  {{ attr.customData.expenseCount }}건
                </span>
                <span class="amount text-red">
                  -{{ formatCurrency(attr.customData.expenseTotal) }}원
                </span>
              </div>

              <div class="popover-divider"></div>

              <div class="popover-row net-row">
                <span class="label">순이익</span>
                <span
                  class="amount"
                  :class="
                    attr.customData.netAmount >= 0 ? 'text-blue' : 'text-red'
                  "
                >
                  {{ attr.customData.netAmount > 0 ? "+" : ""
                  }}{{ formatCurrency(attr.customData.netAmount) }}원
                </span>
              </div>
            </div>
          </template>
        </Calendar>
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
  position: relative;
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

.view-all {
  text-decoration: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  color: #666 !important;
  font-size: 0.9rem;
}
.view-all:visited,
.view-all:active {
  text-decoration: none !important;
  border-bottom: none !important;
  color: #666 !important;
}
.view-all:hover {
  text-decoration: none !important;
  color: #28c76f !important;
}

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

.custom-popover {
  padding: 4px;
  min-width: 170px;
}
.popover-header {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #e0e0e0;
}
.popover-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
}
.popover-row .label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cccccc;
}
.popover-row .amount {
  font-weight: bold;
}
.dot-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.popover-divider {
  height: 1px;
  background-color: #444;
  margin: 12px 0;
}
.net-row {
  margin-bottom: 0;
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
:deep(.vc-container.custom-calendar) {
  font-family: inherit !important;
}
:deep(.vc-popover-content-wrapper .vc-popover-content) {
  background-color: #333 !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 8px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  white-space: pre-line !important;
  line-height: 1.5;
}
:deep(.vc-day) {
  min-height: 64px;
  width: 100%;
  padding: 8px 4px;
  cursor: pointer;
}
:deep(.vc-day-content) {
  font-size: 1.2rem !important;
  width: 36px !important;
  height: 36px !important;
}

/* 1. 상단 년/월 타이틀 배경 제거 및 호버 시 글자색만 변경 */
:deep(.vc-title) {
  font-family: inherit !important;
  font-size: 1.2rem !important;

  background-color: transparent !important; /* 기본 회색 배경 제거 */
  transition: color 0.2s ease-in-out; /* 부드러운 색상 전환 효과 (선택 사항) */
}

:deep(.vc-title:hover) {
  background-color: transparent !important; /* 호버 시에도 배경 투명 유지 */
  color: #28c76f !important; /* 마우스를 올렸을 때 바뀔 글자 색상 (현재 테마의 초록색) */
  opacity: 0.8; /* 살짝 투명해지는 효과를 원하면 추가 (필요 없으면 삭제) */
}

/* 2. 좌우 화살표 버튼 배경 제거 및 호버 시 아이콘 색상만 변경 */
:deep(.vc-arrow) {
  background-color: transparent !important; /* 화살표 뒤 회색 배경 제거 */
  transition: color 0.2s ease-in-out;
}

:deep(.vc-arrow:hover) {
  background-color: transparent !important; /* 호버 시에도 배경 투명 유지 */
  color: #28c76f !important; /* 마우스를 올렸을 때 바뀔 화살표 색상 */
}
:deep(.vc-arrow) {
  width: 36px !important;
  height: 36px !important;
}
:deep(.vc-arrow svg) {
  width: 24px !important;
  height: 24px !important;
}
:deep(.vc-header) {
  padding-bottom: 15px !important;
}
:deep(.vc-weekday) {
  font-size: 1rem !important;
  padding-bottom: 10px;
}

@media screen and (max-width: 1024px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  .bottom-section {
    grid-template-columns: 1fr;
  }
  .summary-card .chart-container {
    display: none;
  }
}
</style>
