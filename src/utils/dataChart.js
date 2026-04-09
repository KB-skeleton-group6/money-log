import { computed, ref } from "vue";
import dayjs from "dayjs";

// --- 1. 포맷팅 유틸 함수 ---
export const formatCurrency = (val) =>
  new Intl.NumberFormat("ko-KR").format(val);

export const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// --- 2. 반응형 상단 카드 & 차트 계산 로직 ---
export function useDashboardCalculations(transactionsRef) {
  const today = dayjs().startOf("month");

  const stats = computed(() => {
    const labels = [];
    const incomes = [0, 0, 0, 0, 0, 0, 0];
    const expenses = [0, 0, 0, 0, 0, 0, 0];
    const incomeCounts = [0, 0, 0, 0, 0, 0, 0];
    const expenseCounts = [0, 0, 0, 0, 0, 0, 0];
    const totalCounts = [0, 0, 0, 0, 0, 0, 0];
    const monthlyNets = [0, 0, 0, 0, 0, 0, 0];
    let olderNet = 0;

    for (let i = 6; i >= 0; i--) {
      labels.push(dayjs().subtract(i, "month").format("M월"));
    }

    transactionsRef.value.forEach((t) => {
      const txMonth = dayjs(t.transacted_at).startOf("month");
      const monthDiff = today.diff(txMonth, "month");

      if (monthDiff >= 0 && monthDiff <= 6) {
        const index = 6 - monthDiff;
        if (t.type === "INCOME") {
          incomes[index] += t.amount;
          incomeCounts[index]++;
        }
        if (t.type === "EXPENSE") {
          expenses[index] += Math.abs(t.amount);
          expenseCounts[index]++;
        }
        monthlyNets[index] += t.amount;
        totalCounts[index]++;
      } else if (monthDiff > 6) {
        olderNet += t.amount;
      }
    });

    const cumulativeNets = [];
    let currentRunningTotal = olderNet;

    for (let i = 0; i < 7; i++) {
      currentRunningTotal += monthlyNets[i];
      cumulativeNets.push(currentRunningTotal);
    }

    const chartNets = cumulativeNets.map((val) => (val < 0 ? 0 : val));

    return {
      labels,
      incomes,
      expenses,
      cumulativeNets,
      chartNets,
      incomeCounts,
      expenseCounts,
      totalCounts,
      monthlyNets,
    };
  });

  const totalIncome = computed(() => stats.value.incomes[6]);
  const totalExpense = computed(() => stats.value.expenses[6]);
  const netIncome = computed(() => stats.value.cumulativeNets[6]);

  const calculateRateInfo = (current, previous, previousCount) => {
    if (previousCount === 0) {
      return { text: " 전월 기록 없음", icon: "fa-minus" };
    }
    let rate = 0;
    if (previous === 0) {
      rate = current === 0 ? 0 : current > 0 ? 100 : -100;
    } else {
      rate = ((current - previous) / Math.abs(previous)) * 100;
    }
    return {
      text: ` ${Math.abs(rate).toFixed(1)}% 전월 대비`,
      icon: rate > 0 ? "fa-caret-up" : rate < 0 ? "fa-caret-down" : "fa-minus",
    };
  };

  const netRate = computed(() =>
    calculateRateInfo(
      stats.value.monthlyNets[6],
      stats.value.monthlyNets[5],
      stats.value.totalCounts[5],
    ),
  );
  const incomeRate = computed(() =>
    calculateRateInfo(
      stats.value.incomes[6],
      stats.value.incomes[5],
      stats.value.incomeCounts[5],
    ),
  );
  const expenseRate = computed(() =>
    calculateRateInfo(
      stats.value.expenses[6],
      stats.value.expenses[5],
      stats.value.expenseCounts[5],
    ),
  );

  // ✨ [NEW] Vue Native 툴팁 상태 관리
  const tooltipState = ref({
    show: false,
    activeId: null,
    x: 0,
    y: 0,
    month: "",
    count: 0,
    value: 0,
  });

  const createChartOptions = (chartId) => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false, beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false, // 기본 툴팁 끄기
        external: (context) => {
          const { tooltip } = context;

          // 마우스가 나가면 툴팁 숨기기
          if (tooltip.opacity === 0) {
            if (tooltipState.value.activeId === chartId)
              tooltipState.value.show = false;
            return;
          }

          // 데이터 추출하여 Vue 상태 업데이트
          const dataIndex = tooltip.dataPoints[0].dataIndex;
          const dataset = tooltip.dataPoints[0].dataset;

          tooltipState.value = {
            show: true,
            activeId: chartId,
            x: tooltip.caretX,
            y: tooltip.caretY - 8,
            month: tooltip.title[0],
            count: dataset.counts[dataIndex],
            value: dataset.realValues[dataIndex],
          };
        },
      },
    },
    layout: { padding: 0 },
    interaction: { mode: "index", intersect: true },
  });

  // 3개의 차트에 각각 고유 ID를 부여하여 옵션 생성
  const chartOptionsNet = createChartOptions("net");
  const chartOptionsIncome = createChartOptions("income");
  const chartOptionsExpense = createChartOptions("expense");

  const createChartData = (
    labels,
    dataArr,
    countsArr,
    realValuesArr,
    color,
  ) => ({
    labels: labels,
    datasets: [
      {
        data: dataArr,
        counts: countsArr,
        realValues: realValuesArr,
        backgroundColor: color,
        borderRadius: 4,
        minBarLength: 4,
      },
    ],
  });

  const chartDataNet = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.chartNets,
      stats.value.totalCounts,
      stats.value.cumulativeNets,
      "#48c774",
    ),
  );
  const chartDataIncome = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.incomes,
      stats.value.incomeCounts,
      stats.value.incomes,
      "#3e8ed0",
    ),
  );
  const chartDataExpense = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.expenses,
      stats.value.expenseCounts,
      stats.value.expenses,
      "#f14668",
    ),
  );

  return {
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
  };
}
