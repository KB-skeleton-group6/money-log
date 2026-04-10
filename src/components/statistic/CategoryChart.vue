<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCategoryStats } from '@/composables/useCategoryStats';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  activeType: String,
});

const { aggregatedStats } = useCategoryStats(() => props.activeType);

const processedData = computed(() => {
  if (aggregatedStats.value.length === 0) {
    return { labels: [], values: [], colors: [], count: 0 };
  }

  const totalSum = aggregatedStats.value.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return {
    labels: aggregatedStats.value.map((r) => r.name),
    values: aggregatedStats.value.map((r) =>
      totalSum > 0 ? ((r.amount / totalSum) * 100).toFixed(1) : 0,
    ),
    colors: aggregatedStats.value.map((r) => r.color),
    count: aggregatedStats.value.length,
  };
});

const chartData = computed(() => ({
  labels: processedData.value.labels,
  datasets: [
    {
      data: processedData.value.values,
      backgroundColor: processedData.value.colors,
      borderWidth: 0,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <div class="category-section">
    <div v-if="processedData.labels.length > 0" class="chart-content">
      <div class="donut-wrapper">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="center-text">
          <p>{{ processedData.count }}개 항목</p>
          <p class="total">전체</p>
        </div>
      </div>

      <ul class="legend-list">
        <li v-for="(item, index) in processedData.labels" :key="index">
          <span
            class="dot"
            :style="{ backgroundColor: processedData.colors[index] }"
          ></span>
          <span class="label-name">{{ item }}</span>
          <span class="percent">{{ processedData.values[index] }}%</span>
        </li>
      </ul>
    </div>

    <div v-else class="no-data">표시할 내역이 없습니다.</div>
  </div>
</template>

<style scoped>
.category-section {
  background: white;
  padding: 24px;
  border-radius: 15px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.chart-content {
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
}
.donut-wrapper {
  width: 200px;
  height: 200px;
  position: relative;
}
.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.center-text .total {
  font-weight: bold;
  font-size: 1.1rem;
}

.legend-list {
  list-style: none;
  padding: 0;
  flex: 1;
}
.legend-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}
.label-name {
  flex: 1;
  color: #57606f;
}
.percent {
  color: #2f3542;
  font-weight: 600;
}
.no-data {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

/* 모바일 화면 최적화 */
@media (max-width: 768px) {
  .chart-content {
    flex-direction: column; /* 가로 배치를 세로 배치로 변경 */
    gap: 24px; /* 모바일 화면에 맞게 간격 조절 */
  }
  .legend-list {
    width: 100%; /* 범례 영역이 화면을 꽉 채우도록 설정 */
  }
}
</style>
