import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { formatAmountShort } from '@/utils/formatter';

export function useDashboardCalculations(transactionsRef) {
  const today = dayjs().startOf('month');

  const stats = computed(() => {
    const labels = [];
    const incomes = [0, 0, 0, 0, 0, 0, 0];
    const expenses = [0, 0, 0, 0, 0, 0, 0];
    const incomeCounts = [0, 0, 0, 0, 0, 0, 0];
    const expenseCounts = [0, 0, 0, 0, 0, 0, 0];
    const totalCounts = [0, 0, 0, 0, 0, 0, 0];
    const monthlyNets = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 6; i >= 0; i--) {
      labels.push(dayjs().subtract(i, 'month').format('M월'));
    }

    transactionsRef.value.forEach((t) => {
      const txMonth = dayjs(t.transacted_at).startOf('month');
      const monthDiff = today.diff(txMonth, 'month');

      if (monthDiff >= 0 && monthDiff <= 6) {
        const index = 6 - monthDiff;
        if (t.type === 'INCOME') {
          incomes[index] += t.amount;
          incomeCounts[index]++;
          monthlyNets[index] += t.amount;
        }
        if (t.type === 'EXPENSE') {
          expenses[index] += t.amount;
          expenseCounts[index]++;
          monthlyNets[index] -= t.amount;
        }
        totalCounts[index]++;
      }
    });

    return { labels, incomes, expenses, monthlyNets, incomeCounts, expenseCounts, totalCounts };
  });

  const totalIncome = computed(() => stats.value.incomes[6]);
  const totalExpense = computed(() => stats.value.expenses[6]);
  const netIncome = computed(() => stats.value.monthlyNets[6]);

  const formatTotalIncome = computed(() => formatAmountShort(totalIncome.value));
  const formatTotalExpense = computed(() => formatAmountShort(totalExpense.value));
  const formatNetIncome = computed(() => formatAmountShort(Math.abs(netIncome.value)));

  const calculateRateInfo = (current, previous, previousCount) => {
    if (previousCount === 0) return { text: ' 전월 기록 없음', icon: 'fa-minus' };
    let rate = 0;
    if (previous === 0) {
      rate = current === 0 ? 0 : current > 0 ? 100 : -100;
    } else {
      rate = ((current - previous) / Math.abs(previous)) * 100;
    }
    return {
      text: ` ${Math.abs(rate).toFixed(1)}% 전월 대비`,
      icon: rate > 0 ? 'fa-caret-up' : rate < 0 ? 'fa-caret-down' : 'fa-minus',
    };
  };

  const netRate = computed(() =>
    calculateRateInfo(stats.value.monthlyNets[6], stats.value.monthlyNets[5], stats.value.totalCounts[5]),
  );
  const incomeRate = computed(() =>
    calculateRateInfo(stats.value.incomes[6], stats.value.incomes[5], stats.value.incomeCounts[5]),
  );
  const expenseRate = computed(() =>
    calculateRateInfo(stats.value.expenses[6], stats.value.expenses[5], stats.value.expenseCounts[5]),
  );

  const tooltipState = ref({
    show: false,
    activeId: null,
    x: 0,
    y: 0,
    month: '',
    count: 0,
    value: 0,
  });

  const createChartOptions = (chartId, { allowNegative = false } = {}) => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false, ...(allowNegative ? {} : { beginAtZero: true }) },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: (context) => {
          const { tooltip } = context;
          if (tooltip.opacity === 0) {
            if (tooltipState.value.activeId === chartId) tooltipState.value.show = false;
            return;
          }
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
    interaction: { mode: 'index', intersect: true },
  });

  const chartOptionsNet = createChartOptions('net');
  const chartOptionsIncome = createChartOptions('income');
  const chartOptionsExpense = createChartOptions('expense');

  const createChartData = (labels, dataArr, countsArr, realValuesArr, color) => ({
    labels,
    datasets: [{
      data: dataArr,
      counts: countsArr,
      realValues: realValuesArr,
      backgroundColor: color,
      borderRadius: 4,
      minBarLength: 4,
    }],
  });

  const chartDataNet = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.monthlyNets.map(Math.abs),
      stats.value.totalCounts,
      stats.value.monthlyNets,
      stats.value.monthlyNets.map((v) => (v >= 0 ? '#48c774' : '#f14668')),
    ),
  );
  const chartDataIncome = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.incomes,
      stats.value.incomeCounts,
      stats.value.incomes,
      '#3e8ed0',
    ),
  );
  const chartDataExpense = computed(() =>
    createChartData(
      stats.value.labels,
      stats.value.expenses,
      stats.value.expenseCounts,
      stats.value.expenses,
      '#f14668',
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
    formatTotalIncome,
    formatTotalExpense,
    formatNetIncome,
  };
}
