<script setup>
import { useCategoryStore } from "@/stores/categories/useCategoryStore";
import { formatAmount, formatAmountShort } from "@/utils/formatter";
import { computed, ref, watch } from "vue";

const categoryStore = useCategoryStore();
const isEditMode = ref(false);

const expenseCategories = computed(() =>
  categoryStore.categories.filter((cat) => cat.type === "EXPENSE"),
);

const budgets = ref({});

watch(expenseCategories, (cats) => {
  if (cats.length && !Object.keys(budgets.value).length) {
    budgets.value = Object.fromEntries(cats.map((cat) => [cat.id, 100000]));
  }
}, { immediate: true });

const draftBudgets = ref({});

const enterEditMode = () => {
  draftBudgets.value = { ...budgets.value };
  isEditMode.value = true;
};

const cancelEdit = () => {
  isEditMode.value = false;
};

const saveEdit = () => {
  budgets.value = { ...draftBudgets.value };
  isEditMode.value = false;
};

const totalBudget = computed(() => {
  const source = isEditMode.value ? draftBudgets.value : budgets.value;
  return Object.values(source).reduce((sum, v) => sum + v, 0);
});

const formatKRW = (amount) => formatAmount(amount) + "원";

const formatComma = (amount) => Number(amount).toLocaleString("ko-KR");

const onBudgetInput = (event, catId) => {
  const raw = event.target.value.replace(/[^0-9]/g, "");
  const num = parseInt(raw) || 0;
  draftBudgets.value[catId] = num;
  event.target.value = num.toLocaleString("ko-KR");
};

const getPercent = (catId) => {
  if (totalBudget.value === 0) return 0;
  return (budgets.value[catId] / totalBudget.value) * 100;
};

const formatPercent = (catId) => {
  return `전체의 ${getPercent(catId).toFixed(1)}%`;
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
</script>

<template>
  <div class="budget-section">
    <div class="budget-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="fa-solid fa-wallet"></i>
        </div>
        <div class="header-titles">
          <span class="title">월별 예산 설정</span>
          <span class="subtitle">카테고리별 월 지출 한도를 설정하세요</span>
        </div>
        <button
          v-if="!isEditMode"
          class="edit-btn edit-btn--mobile"
          @click="enterEditMode"
        >
          <i class="fa-solid fa-pencil"></i>
        </button>
      </div>
      <div class="header-right">
        <div class="total-budget">
          <span class="total-label">총 예산</span>
          <span class="total-amount">{{ formatAmountShort(totalBudget) }}</span>
        </div>
        <button
          v-if="!isEditMode"
          class="edit-btn edit-btn--desktop"
          @click="enterEditMode"
        >
          <i class="fa-solid fa-pencil"></i>
          <span>수정</span>
        </button>
      </div>
    </div>

    <div class="category-grid">
      <div v-for="cat in expenseCategories" :key="cat.id" class="category-card">
        <div class="card-top">
          <div class="cat-header">
            <div
              class="cat-icon"
              :style="{
                backgroundColor: hexToRgba(cat.subColor, 0.4),
                color: cat.color,
              }"
            >
              <i :class="cat.icon"></i>
            </div>
            <span class="cat-name">{{ cat.name }}</span>
          </div>
        </div>
        <div v-if="isEditMode" class="budget-input-wrapper">
          <input
            class="budget-input"
            type="text"
            :value="formatComma(draftBudgets[cat.id])"
            @input="onBudgetInput($event, cat.id)"
          />
          <span class="unit">원</span>
        </div>
        <template v-if="!isEditMode">
          <span class="cat-amount">{{ formatKRW(budgets[cat.id]) }}</span>
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{
                width: getPercent(cat.id) + '%',
                backgroundColor: cat.color,
              }"
            ></div>
          </div>
          <span class="cat-percent">{{ formatPercent(cat.id) }}</span>
        </template>
      </div>
    </div>

    <div v-if="isEditMode" class="edit-actions">
      <button class="cancel-btn" @click="cancelEdit">취소</button>
      <button class="save-btn" @click="saveEdit">저장하기</button>
    </div>
  </div>
</template>

<style scoped>
.budget-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

.budget-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #e0f8f1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #00a572;
  font-size: 16px;
  flex: 0 0 auto;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-titles .title {
  font-size: 14px;
  font-weight: bold;
  color: #1c1c1e;
}

.header-titles .subtitle {
  font-size: 11px;
  color: #8a8a8e;
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.total-budget {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.total-budget .total-label {
  font-size: 11px;
  color: #8a8a8e;
}

.total-budget .total-amount {
  font-size: 15px;
  font-weight: bold;
  color: #00c78b;
}

.edit-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid #e8e8ed;
  border-radius: 8px;
  padding: 8px;
  background: none;
  color: #1c1c1e;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.edit-btn--mobile {
  display: none;
  margin-left: auto;
  border: none;
  padding: 4px;
}

.edit-btn > i {
  font-size: 10px;
}

.edit-btn:hover {
  background-color: #f5f5f7;
}

/* Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 8px 8px;
}

.category-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  background-color: white;
  border: 1px solid #e8e8ed;
}

.card-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.cat-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.cat-icon {
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  flex: 0 0 auto;
}

.cat-name {
  font-size: 13px;
  font-weight: bold;
  color: #1c1c1e;
}

.cat-amount {
  font-size: 14px;
  font-weight: bold;
  color: #1c1c1e;
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background-color: #e8e8ed;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.cat-percent {
  font-size: 11px;
  color: #8a8a8e;
}

.budget-input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
}

.budget-input-wrapper:focus-within {
  border-color: #00c78b;
}

.budget-input {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: bold;
  color: #1c1c1e;
  background: transparent;
  text-align: right;
}

.unit {
  font-size: 13px;
  font-weight: normal;
  color: #48484a;
  flex: 0 0 auto;
}

.edit-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 0 8px 8px;
}

.edit-actions > button {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8e8ed;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background-color: white;
  color: #48484a;
}

.cancel-btn:hover {
  background-color: #f5f5f7;
}

.save-btn {
  background-color: #00c78b;
  color: white;
  border-color: #00c78b;
}

.save-btn:hover {
  background-color: #00a572;
}

@media (max-width: 768px) {
  .budget-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px;
  }

  .edit-btn > span {
    display: none;
  }

  .edit-btn {
    border: none;
    padding: 4px;
    background: none;
  }

  .total-budget {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .total-budget .total-label {
    font-size: 12px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .cat-amount {
    text-align: right;
  }
}
</style>
