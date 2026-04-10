<script setup>
import { computed } from 'vue';
import { formatAmount } from '@/utils/formatter';
import { useCategoryStats } from '@/composables/useCategoryStats';

const props = defineProps({
  activeType: {
    type: String,
    required: true,
  },
});

const { aggregatedStats } = useCategoryStats(() => props.activeType);

const sortedData = computed(() => {
  // Top 5개 항목만 추출
  return aggregatedStats.value.slice(0, 5);
});

// 프로그레스 바 너비 계산
const calculateWidth = (amount) => {
  if (sortedData.value.length === 0) return 0;
  const maxAmount = sortedData.value[0].amount;
  return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
};
</script>

<template>
  <div class="top-category-list main-content-card">
    <!-- 데이터가 있을 때만 헤더와 리스트 표시 -->
    <template v-if="sortedData.length > 0">
      <div class="header">
        <h3>{{ activeType === 'expense' ? '지출' : '수입' }} TOP 카테고리</h3>
      </div>

      <ul class="ranking-list">
        <li v-for="(item, index) in sortedData" :key="index">
          <div class="rank-badge">{{ index + 1 }}</div>

          <div class="rank-info">
            <div class="category-meta">
              <div
                class="icon-wrapper"
                :style="{
                  backgroundColor: item.color + '1A',
                  color: item.color,
                }"
              >
                <i :class="item.icon"></i>
              </div>
              <span class="rank-name">{{ item.name }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: calculateWidth(item.amount) + '%',
                  backgroundColor: item.color,
                }"
              ></div>
            </div>
          </div>

          <div class="rank-amount">
            <span class="amount-val" :class="activeType">
              {{ activeType === 'expense' ? '-' : '+'
              }}{{ formatAmount(Math.abs(item.amount)) }}원
            </span>
            <span class="count-val">{{ item.count }}건</span>
          </div>
        </li>
      </ul>
    </template>

    <div v-else class="empty-msg">
      <i class="fa-regular fa-folder-open"></i>
      <p>데이터가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.top-category-list {
  background: white;
  padding: 24px;
  border-radius: 16px;
  min-height: 450px;
}
.header h3 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
}
.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ranking-list li {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.rank-badge {
  font-weight: 800;
  color: #bdc3c7;
  font-size: 1.1rem;
  width: 20px;
}
.rank-info {
  flex: 1;
}
.category-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.rank-name {
  font-size: 0.95rem;
  font-weight: 600;
}
.progress-bar {
  height: 6px;
  background: #f1f2f6;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease-out;
}
.rank-amount {
  text-align: right;
  display: flex;
  flex-direction: column;
}
.amount-val {
  font-weight: 700;
  font-size: 0.95rem;
}
.amount-val.expense {
  color: #ea5455;
}
.amount-val.income {
  color: #00cfe8;
}
.count-val {
  font-size: 0.75rem;
  color: #999;
}
.empty-msg {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #999;
}
.empty-msg i {
  font-size: 3rem;
  color: #ddd;
}
.empty-msg p {
  margin: 0;
  font-size: 1rem;
}
</style>
