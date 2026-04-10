<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useTransactionStore } from '@/stores/useTransactionStore';
import { storeToRefs } from 'pinia';
import { aggregateChartData } from '@/utils/chartUtils';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
);

const props = defineProps({
  filterType: {
    type: String,
    default: 'weekly',
  },
});

const store = useTransactionStore();
const { transactions } = storeToRefs(store);

const chartTitle = computed(() => {
  const titleMap = {
    weekly: '주간별',
    monthly: '월별',
    quarterly: '분기별',
    yearly: '연도별',
  };
  return `${titleMap[props.filterType] || '기간별'} 수입 · 지출 · 순이익`;
});

const processedChartData = computed(() => {
  if (!transactions.value.length) return null;

  return aggregateChartData(transactions.value, props.filterType);
});

const chartData = computed(() => {
  const data = processedChartData.value;
  if (!data) return { labels: [], datasets: [] };

  const applyWeight = (val) => Math.sign(val) * Math.sqrt(Math.abs(val));

  return {
    labels: data.labels,
    datasets: [
      {
        label: '순이익',
        type: 'line',
        data: data.profits.map(applyWeight),
        borderColor: '#28c76f',
        backgroundColor: '#28c76f',
        tension: 0.4,
        pointRadius: 4,
        fill: false,
        zIndex: 2,
        yAxisID: 'y1', // 순이익은 우측(y1) 축을 사용
      },
      {
        label: '수입',
        type: 'bar',
        data: data.incomes.map(applyWeight),
        backgroundColor: '#00cfe8',
        borderRadius: 6,
        barPercentage: 0.5,
        yAxisID: 'y', // 수입은 좌측(y) 축을 사용
      },
      {
        label: '지출',
        type: 'bar',
        data: data.expenses.map(applyWeight),
        backgroundColor: '#ea5455',
        borderRadius: 6,
        barPercentage: 0.5,
        yAxisID: 'y', // 지출은 좌측(y) 축을 사용
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 10 },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const realValue = Math.round(
            Math.sign(context.raw) * Math.pow(Math.abs(context.raw), 2),
          );
          return `${context.dataset.label}: ${realValue.toLocaleString()}원`;
        },
      },
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: '수입 · 지출',
        color: '#888',
        font: { size: 12, weight: 'bold' },
      },
      ticks: {
        callback: (value) => {
          const realValue = Math.round(
            Math.sign(value) * Math.pow(Math.abs(value), 2),
          );
          return (realValue / 10000).toLocaleString() + '만';
        },
      },
      grid: { color: '#f0f0f0' },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: '순이익',
        color: '#28c76f',
        font: { size: 12, weight: 'bold' },
      },
      ticks: {
        callback: (value) => {
          const realValue = Math.round(
            Math.sign(value) * Math.pow(Math.abs(value), 2),
          );
          return (realValue / 10000).toLocaleString() + '만';
        },
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    x: {
      grid: { display: false },
    },
  },
};
</script>

<template>
  <div class="chart-container main-content-card">
    <h3>{{ chartTitle }}</h3>
    <div class="canvas-wrapper">
      <Bar
        v-if="processedChartData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="loading-placeholder">데이터 분석 중...</div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
}
.canvas-wrapper {
  height: 300px;
  position: relative;
}
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}
h3 {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
}

/* 모달 관련 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
}

.data-row.income strong {
  color: #00cfe8;
}
.data-row.expense strong {
  color: #ea5455;
}
.data-row.profit {
  font-size: 1.1rem;
  margin-top: 16px;
}
.data-row.profit strong {
  color: #28c76f;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
