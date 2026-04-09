<script setup>
import { ref, computed } from 'vue';
import { useAddTransactionStore } from '@/stores/transactions/useAddTransactionStore';
import { Categories } from '../../constant/categories';
import { Payments } from '../../constant/paymentMethods';

const addTransactionStore = useAddTransactionStore();
const formData = addTransactionStore.formData;

const categorizedList = computed(() => {
  const allList = Object.values(Categories);

  return {
    INCOME: allList.filter((cat) => cat.label === 'INCOME'),
    EXPENSE: allList.filter((cat) => cat.label === 'EXPENSE'),
  };
});

const paymentMethods = computed(() => {
  const allList = Object.values(Payments);

  return {
    ALL: allList,
  };
});

const memoLength = computed(() => formData.memo.length);

const handleSubmit = () => {
  if (!formData.category_id || !formData.amount) {
    alert('금액과 카테고리는 필수입니다.');
    return;
  }
  // 스토어의 제출 함수 호출
  addTransactionStore.submitTransaction();
};
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="addTransactionStore.isOpen"
        class="modal-overlay"
        @mousedown.self="addTransactionStore.closeModal"
      >
        <div class="modal">
          <div class="modal-header">
            <!-- <h2 class="modal-title">거래 추가</h2> -->
            <h2 class="modal-title">
              {{ addTransactionStore.isEditMode ? '거래 수정' : '거래 추가' }}
            </h2>
            <button class="close-btn" @click="addTransactionStore.closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form class="form-container" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label">거래 유형</label>
              <div class="toggle-container">
                <div
                  class="toggle-item income"
                  :class="{ selected: formData.type === 'INCOME' }"
                  @click="formData.type = 'INCOME'"
                >
                  <i class="fa-solid fa-arrow-up"></i> <span>수입</span>
                </div>
                <div
                  class="toggle-item expense"
                  :class="{ selected: formData.type === 'EXPENSE' }"
                  @click="formData.type = 'EXPENSE'"
                >
                  <i class="fa-solid fa-arrow-down"></i> <span>지출</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">날짜</label>
              <div class="input-box clickable">
                <input
                  type="date"
                  v-model="formData.transacted_at"
                  class="input-control no-border"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">금액</label>
              <div class="input-box">
                <i class="fa-solid fa-money-bill-wave input-icon"></i>
                <input
                  type="number"
                  class="input-control text-right bold"
                  v-model="formData.amount"
                  placeholder="0"
                />
                <span class="input-suffix">원</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">카테고리</label>
              <div class="category-grid">
                <div
                  v-for="cat in categorizedList[formData.type]"
                  :key="cat.id"
                  class="category-item"
                  :class="{ selected: formData.category_id === cat.id }"
                  @click="formData.category_id = cat.id"
                >
                  <i :class="cat.icon"></i>
                  <span>{{ cat.name }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">상세 내용</label>
              <div class="input-box">
                <i class="fa-solid fa-pen input-icon"></i>
                <input
                  type="text"
                  class="input-control"
                  v-model="formData.detail"
                  placeholder="예) 아메리카노 구매"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label class="form-label">메모 (선택)</label>
                <span class="char-count">{{ memoLength }}/500</span>
              </div>
              <div class="input-box">
                <textarea
                  class="input-control textarea"
                  v-model="formData.memo"
                  placeholder="추가 메모를 입력하세요"
                ></textarea>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">결제 수단</label>
              <div class="pills-container">
                <div
                  v-for="method in paymentMethods.ALL"
                  :key="method.id"
                  class="pill-item"
                  :class="{ selected: method.value == formData.method }"
                  @click="formData.method = method.value"
                >
                  {{ method.name }}
                </div>
              </div>
            </div>

            <!-- <button class="add-btn" type="submit">추가하기</button> -->
            <button class="add-btn" type="submit">
              {{ addTransactionStore.isEditMode ? '수정하기' : '추가하기' }}
            </button>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* 기존 스타일 유지 */
.input-control.no-border {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}
.modal {
  --color-primary: #00bc7d;
  --color-primary-bg: #e8fff5;
  --color-income: #00a9ef;
  --color-expense: #ff4977;
  --color-border: #dbe4ee;
  --color-text-muted: #8ca2b9;
  --color-text-dark: #313a46;
  --color-bg-light: #f0f5f9;
  --color-bg-white: #ffffff;

  max-width: 516px;
  max-height: 90vh;
  box-sizing: border-box;
  margin: 20px;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  padding: 36px;
  background-color: var(--color-bg-white);
  border-radius: 16px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  z-index: 999;
  color: var(--color-text-dark);
}

.modal::-webkit-scrollbar {
  width: 8px;
}
.modal::-webkit-scrollbar-track {
  background: transparent;
}
.modal::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  flex-shrink: 0;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 4px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;

  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.form-label {
  font-size: 0.9rem;
  color: #5a6b7c;
  font-weight: 500;
}
.char-count {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.input-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-bg-white);
  transition: all 0.2s ease;
}
.input-box.clickable {
  cursor: pointer;
}
.input-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-bg);
}

.input-control {
  all: unset;
  flex: 1;
  width: 100%;
  font-size: 1rem;
  color: var(--color-text-dark);
  font-family: inherit;
  box-sizing: border-box;
}
.input-control::placeholder {
  color: #cbd5e1;
}
.input-control.textarea {
  height: 80px;
  resize: none;
}

.input-icon {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}
.input-icon.small {
  font-size: 0.9rem;
}
.input-suffix {
  color: var(--color-text-muted);
  font-size: 1rem;
  font-weight: bold;
}

.text-right {
  text-align: right;
}
.bold {
  font-weight: bold;
  font-size: 1.1rem;
}
.input-control[type='number']::-webkit-outer-spin-button,
.input-control[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-control[type='number'] {
  -moz-appearance: textfield;
}

.toggle-container {
  background-color: var(--color-bg-light);
  border-radius: 10px;
  display: flex;
  padding: 6px;
  justify-content: space-between;
}
.toggle-item {
  width: 49%;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: var(--color-bg-white);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  color: var(--color-text-muted);
  font-weight: bold;
  transition: 0.3s;
}
.toggle-item.expense.selected {
  color: var(--color-expense);
}
.toggle-item.income.selected {
  color: var(--color-income);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.category-item {
  aspect-ratio: 1/1;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: 0.2s;
}
.category-item:hover {
  background-color: var(--color-bg-light);
}
.category-item i {
  font-size: 1.4rem;
}
.category-item span {
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  word-break: keep-all;
}
.category-item.selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill-item {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 0.9rem;
  color: #5a6b7c;
  font-weight: 500;
  transition: 0.2s;
}
.pill-item:hover {
  background-color: var(--color-bg-light);
}
.pill-item.selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-bg-white);
}

.add-btn {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  border-radius: 10px;
  background-color: var(--color-primary);
  color: var(--color-bg-white);
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 24px;
  transition: 0.2s;
  flex-shrink: 0;
}
.add-btn:hover {
  background-color: #009e69;
}
.open-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-weight: bold;
}

@media (max-width: 480px) {
  .modal {
    padding: 24px;
  }
  .category-item i {
    font-size: 1.2rem;
  }
  .category-item span {
    font-size: 0.75rem;
  }
}
</style>
