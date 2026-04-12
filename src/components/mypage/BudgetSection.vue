<script setup>
import { useCategoryStore } from "@/stores/categories/useCategoryStore";
import { useBudgetStore } from "@/stores/budgets/useBudgetStore";
import { useTransactionStore } from "@/stores/transactions/useTransactionStore";
import { storeToRefs } from "pinia";
import { formatAmount, formatAmountShort } from "@/utils/formatter";
import { computed, ref, onMounted } from "vue";

const isEditMode = ref(false);
const isSaving = ref(false);

const categoryStore = useCategoryStore();
const expenseCategories = computed(() =>
  categoryStore.categories.filter((cat) => cat.type === "EXPENSE"),
);

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);

onMounted(() => {
  budgetStore.fetchBudgets();
  transactionStore.fetchData();
});

const draftBudgets = ref({});

const enterEditMode = () => {
  draftBudgets.value = Object.fromEntries(
    expenseCategories.value.map((cat) => [cat.id, budgets.value[cat.id] ?? 0]),
  );
  isEditMode.value = true;
};

const cancelEdit = () => {
  isEditMode.value = false;
};

const saveEdit = async () => {
  isSaving.value = true;
  try {
    await budgetStore.saveBudgets(draftBudgets.value);
    isEditMode.value = false;
  } catch {
    alert("저장에 실패했습니다.");
  } finally {
    isSaving.value = false;
  }
};

const transactionStore = useTransactionStore();
const { thisMonthTransactions } = storeToRefs(transactionStore);

const spendingByCategory = computed(() =>
  thisMonthTransactions.value
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[String(t.category_id)] = (acc[String(t.category_id)] ?? 0) + t.amount;
      return acc;
    }, {}),
);

const getSpending = (catId) => spendingByCategory.value[String(catId)] ?? 0;

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
  const budget = budgets.value[String(catId)] ?? 0;
  if (budget === 0) return 0;
  return Math.min((getSpending(catId) / budget) * 100, 100);
};

const isOverBudget = (catId) => {
  const budget = budgets.value[String(catId)] ?? 0;
  return budget > 0 && getSpending(catId) > budget;
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
          <span class="spending-amount" :class="{ 'over-budget': isOverBudget(cat.id) }">
            {{ formatKRW(getSpending(cat.id)) }}
          </span>
          <span class="budget-label">예산 {{ formatKRW(budgets[cat.id] ?? 0) }}</span>
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{
                width: getPercent(cat.id) + '%',
                backgroundColor: isOverBudget(cat.id) ? '#ef4444' : cat.color,
              }"
            ></div>
          </div>
          <span class="cat-percent" :class="{ 'over-budget': isOverBudget(cat.id) }">
            {{ getPercent(cat.id).toFixed(1) }}%
          </span>
        </template>
      </div>
    </div>

    <div v-if="isEditMode" class="edit-actions">
      <button class="cancel-btn" @click="cancelEdit" :disabled="isSaving">취소</button>
      <button class="save-btn" @click="saveEdit" :disabled="isSaving">
        {{ isSaving ? "저장 중..." : "저장하기" }}
      </button>
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

.spending-amount {
  font-size: 14px;
  font-weight: bold;
  color: #1c1c1e;
}

.spending-amount.over-budget {
  color: #ef4444;
}

.budget-label {
  font-size: 11px;
  color: #8a8a8e;
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

.cat-percent.over-budget {
  color: #ef4444;
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

.edit-actions > button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

}

</style>
