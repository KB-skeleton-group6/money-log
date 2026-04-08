<script setup>
import { ref, computed } from "vue";
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

// ChartJS 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

// --- 1. 임시 데이터 (json-server에서 가져올 데이터 모델링) ---
const transactions = ref([
  {
    id: 1,
    user_id: "user1",
    category: "급여",
    amount: 3800000,
    detail: "월급",
    type: "INCOME",
    transacted_at: "2026-04-01 09:00:00",
    icon: "fa-solid fa-money-check-dollar",
    iconBg: "#e6f7ef",
    iconColor: "#28c76f",
  },
  {
    id: 2,
    user_id: "user1",
    category: "카페",
    amount: -6500,
    detail: "스타벅스",
    type: "EXPENSE",
    transacted_at: "2026-04-02 08:30:00",
    icon: "fa-solid fa-mug-hot",
    iconBg: "#fef5e5",
    iconColor: "#ff9f43",
  },
  {
    id: 3,
    user_id: "user1",
    category: "식료품",
    amount: -87400,
    detail: "마트 장보기",
    type: "EXPENSE",
    transacted_at: "2026-04-02 18:20:00",
    icon: "fa-solid fa-basket-shopping",
    iconBg: "#fceaea",
    iconColor: "#ea5455",
  },
  {
    id: 4,
    user_id: "user1",
    category: "구독",
    amount: -17000,
    detail: "넷플릭스",
    type: "EXPENSE",
    transacted_at: "2026-04-03 00:00:00",
    icon: "fa-solid fa-calendar-check",
    iconBg: "#fceaea",
    iconColor: "#ea5455",
  },
  {
    id: 5,
    user_id: "user1",
    category: "부업",
    amount: 450000,
    detail: "프리랜서 수입",
    type: "INCOME",
    transacted_at: "2026-04-04 14:00:00",
    icon: "fa-solid fa-briefcase",
    iconBg: "#e0f2fe",
    iconColor: "#00cfe8",
  },
  {
    id: 6,
    user_id: "user1",
    category: "식비",
    amount: -12000,
    detail: "점심 식사",
    type: "EXPENSE",
    transacted_at: "2026-04-05 12:30:00",
    icon: "fa-solid fa-utensils",
    iconBg: "#fef5e5",
    iconColor: "#ff9f43",
  },
  {
    id: 7,
    user_id: "user1",
    category: "교통",
    amount: -1400,
    detail: "지하철 교통비",
    type: "EXPENSE",
    transacted_at: "2026-04-05 08:10:00",
    icon: "fa-solid fa-train-subway",
    iconBg: "#e0f2fe",
    iconColor: "#00cfe8",
  },
  {
    id: 8,
    user_id: "user1",
    category: "교육",
    amount: -59000,
    detail: "온라인 강의",
    type: "EXPENSE",
    transacted_at: "2026-04-06 20:00:00",
    icon: "fa-solid fa-book-open",
    iconBg: "#f3e8ff",
    iconColor: "#9f7aea",
  },
]);

// --- 2. 상단 카드 계산 및 차트 데이터 ---
const totalIncome = computed(() =>
  transactions.value
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0),
);
const totalExpense = computed(() =>
  transactions.value
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0),
);
const netIncome = computed(() => totalIncome.value + totalExpense.value);

const formatCurrency = (val) => new Intl.NumberFormat("ko-KR").format(val);
const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// 미니 차트 공통 옵션 (축 숨김, 툴팁 숨김 등)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { display: false }, y: { display: false } },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  layout: { padding: 0 },
};

// 시각적 효과를 위한 더미 차트 데이터 세팅
const createChartData = (color) => ({
  labels: ["1", "2", "3", "4", "5", "6", "7"],
  datasets: [
    {
      data: [10, 15, 8, 20, 25, 22, 30],
      backgroundColor: color,
      borderRadius: 4,
    },
  ],
});

const chartDataNet = createChartData("#48c774");
const chartDataIncome = createChartData("#3e8ed0");
const chartDataExpense = createChartData("#f14668");

// --- 3. 달력 로직 ---

// 기준이 되는 날짜 (초기값: 2026년 4월 1일)
const baseDate = ref(dayjs("2026-04-01"));

// 템플릿에서 그대로 사용할 수 있도록 연, 월을 분리
const currentYear = computed(() => baseDate.value.year());
const currentMonth = computed(() => baseDate.value.month() + 1);

// 이전/다음 달 이동 (dayjs 내장 함수로 연도 변경까지 자동 처리)
const prevMonth = () => {
  baseDate.value = baseDate.value.subtract(1, "month");
};
const nextMonth = () => {
  baseDate.value = baseDate.value.add(1, "month");
};

const calendarDays = computed(() => {
  // 이번 달 1일을 기준으로 그 주 일요일(달력 맨 첫 칸)의 날짜를 가져옵니다.
  const startDate = baseDate.value.startOf("month").startOf("week");

  // 달력은 총 6주 * 7일 = 무조건 42칸을 생성합니다.
  return Array.from({ length: 42 }).map((_, index) => {
    // 첫 칸(일요일)부터 1일씩 더해가며 42개의 날짜 객체를 만듭니다.
    const targetDate = startDate.add(index, "day");
    const dateStr = targetDate.format("YYYY-MM-DD");

    // 해당 날짜의 거래내역 필터링
    const dayTx = transactions.value.filter((t) =>
      t.transacted_at.startsWith(dateStr),
    );

    return {
      date: dateStr,
      dayNumber: targetDate.date(), // 일(Day) 표기용
      isCurrentMonth: targetDate.month() === baseDate.value.month(), // 이번 달 여부 (투명도 조절용)
      hasIncome: dayTx.some((t) => t.type === "INCOME"), // 파란 점 표시 여부
      hasExpense: dayTx.some((t) => t.type === "EXPENSE"), // 빨간 점 표시 여부
      transactions: dayTx, // 툴팁에 표시할 데이터
    };
  });
});

// 2026년 4월 7일을 '오늘'로 가정 (이미지 상 민트색 원 적용)
const isToday = (dateStr) => dateStr === "2026-04-07";
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
          <h2 class="text-green">+{{ formatCurrency(netIncome) }}원</h2>
          <p class="change-rate text-green">
            <i class="fa-solid fa-caret-up"></i> 12.5% 전월 대비
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataNet" :options="chartOptions" />
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
            <i class="fa-solid fa-caret-up"></i> 8.3% 전월 대비
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataIncome" :options="chartOptions" />
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
            <i class="fa-solid fa-caret-down"></i> 5.2% 전월 대비
          </p>
        </div>
        <div class="chart-container">
          <Bar :data="chartDataExpense" :options="chartOptions" />
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="card transaction-list-card">
        <div class="card-header border-bottom">
          <h3>최근 거래내역</h3>
          <a href="#" class="view-all">전체보기 ></a>
        </div>
        <ul class="transaction-list">
          <li
            v-for="item in transactions"
            :key="item.id"
            class="transaction-item"
          >
            <div
              class="icon-wrapper"
              :style="{ backgroundColor: item.iconBg, color: item.iconColor }"
            >
              <i :class="item.icon"></i>
            </div>
            <div class="item-info">
              <h4>{{ item.detail }}</h4>
              <p>
                {{ item.category }} · {{ formatDateTime(item.transacted_at) }}
              </p>
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

/* 유틸리티 컬러 */
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

/* 상단 요약 카드 */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  height: 40px;
  margin-top: auto;
  padding-top: 15px;
}

/* 하단 영역 그리드 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 최근 거래내역 리스트 */
.border-bottom {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.view-all {
  color: #28c76f;
  text-decoration: none;
  font-size: 0.9rem;
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

/* 달력 */
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
  background-color: #e6f7ef; /* 민트 배경 */
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

/* 달력 툴팁 (마우스 호버 시) */
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

/* 범례 */
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
