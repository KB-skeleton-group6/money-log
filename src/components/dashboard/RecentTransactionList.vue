<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';
import { DEFAULT_CATEGORY_UI } from '@/constant/categories';
import { formatCurrency } from '@/utils/formatter';

defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});

const { categories } = storeToRefs(useCategoryStore());
const getCat = (id) => categories.value.find((c) => c.id === id) ?? DEFAULT_CATEGORY_UI;

const formatShortDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};
</script>

<template>
  <div class="card transaction-list-card">
    <div class="card-header border-bottom">
      <h3>최근 거래내역</h3>
      <RouterLink to="/ledger/transactions">
        <a class="view-all">전체보기 ></a>
      </RouterLink>
    </div>
    <ul class="transaction-list">
      <li
        v-for="item in transactions"
        :key="item.id"
        class="transaction-item"
      >
        <div
          class="icon-wrapper"
          :style="{
            backgroundColor: getCat(item.category_id).subColor,
            color: getCat(item.category_id).color,
          }"
        >
          <i :class="getCat(item.category_id).icon"></i>
        </div>
        <div class="item-info">
          <h4>{{ item.detail }}</h4>
          <p>{{ getCat(item.category_id).name }}</p>
        </div>
        <div class="item-right">
          <span
            class="item-amount"
            :class="item.type === 'INCOME' ? 'text-blue' : 'text-red'"
          >
            {{ item.type === 'INCOME' ? '+' : '-' }}{{ formatCurrency(item.amount) }}원
          </span>
          <span class="item-date">{{ formatShortDate(item.transacted_at) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
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
.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.transaction-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
  overflow: hidden;
  width: 100%;
}
.transaction-item:last-child {
  border-bottom: none;
}
.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-right: 12px;
  flex-shrink: 0;
}
.item-info {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  overflow: hidden;
}
.item-info h4 {
  margin: 0 0 2px 0;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-info p {
  margin: 0;
  font-size: 0.78rem;
  color: #aaa;
}
.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
  min-width: 0;
  max-width: 45%;
}
.item-amount {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
}
.item-date {
  font-size: 0.75rem;
  color: #bbb;
}
.text-blue { color: #00cfe8; }
.text-red  { color: #ea5455; }

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }
  .icon-wrapper {
    width: 34px;
    height: 34px;
    font-size: 1rem;
    margin-right: 10px;
  }
  .item-amount {
    font-size: 0.88rem;
  }
  .item-info h4 {
    font-size: 0.88rem;
  }
}
</style>
