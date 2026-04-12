<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAddTransactionStore } from "@/stores/transactions/useAddTransactionStore";
import { useCategoryStore } from "@/stores/categories/useCategoryStore";
import { useTransactionTemplateStore } from "@/stores/transactions/useTransactionTemplateStore";
import { usePaymentMethodStore } from "@/stores/payments/usePaymentMethodStore";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

const addTransactionStore = useAddTransactionStore();
const categoryStore = useCategoryStore();
const templateStore = useTransactionTemplateStore();
const paymentMethodStore = usePaymentMethodStore();
const { paymentMethods } = storeToRefs(paymentMethodStore);
const formData = addTransactionStore.formData;

const bookmarkOn = ref(false);

const categorizedList = computed(() => {
  return {
    INCOME: categoryStore.categories.filter((cat) => cat.type === "INCOME"),
    EXPENSE: categoryStore.categories.filter((cat) => cat.type === "EXPENSE"),
  };
});

const filterNumber = (event) => {
  const filteredValue = event.target.value.replace(/[^0-9]/g, "");

  formData.amount = filteredValue;
};

const memoLength = computed(() => formData.memo.length);

const handleSubmit = async () => {
  if (!formData.category_id) {
    const defaultCode = formData.type === 'INCOME' ? 'ETC_INCOME' : 'ETC_EXPENSE';
    formData.category_id = categoryStore.categories.find((c) => c.code === defaultCode)?.id;
  }
  if (!formData.amount) {
    formData.amount = 0;
  }
  if (!formData.detail) {
    formData.detail = categoryStore.getCategoryById(formData.category_id)?.name;
  }
  if (formData.type !== 'EXPENSE') {
    formData.payment = null;
  }

  // 북마크가 켜져 있으면 제출 전 스냅샷 캡처 (폼은 제출 후 초기화되므로)
  const shouldSaveTemplate = bookmarkOn.value && !addTransactionStore.isEditMode;
  const templateSnapshot = shouldSaveTemplate ? { ...formData } : null;

  const isSuccess = await addTransactionStore.submitTransaction();

  if (isSuccess && shouldSaveTemplate) {
    await templateStore.addTemplate(templateSnapshot);
    bookmarkOn.value = false;
  }
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
        <div
          class="modal"
          :class="{
            income: formData.type === 'INCOME',
            expense: formData.type === 'EXPENSE',
          }"
        >
          <div class="modal-header">
            <h2 class="modal-title">
              {{ addTransactionStore.isEditMode ? "거래 수정" : "거래 추가" }}
            </h2>
            <div class="header-actions">
              <button
                v-if="!addTransactionStore.isEditMode"
                type="button"
                class="bookmark-btn"
                :class="{ active: bookmarkOn }"
                @click="bookmarkOn = !bookmarkOn"
                :title="bookmarkOn ? '즐겨찾기 저장 켜짐 (추가 시 템플릿 저장)' : '즐겨찾기 저장 꺼짐'"
              >
                <i :class="bookmarkOn ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
              </button>
              <button class="close-btn" @click="addTransactionStore.closeModal">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
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
              <DatePicker
                v-model="formData.transacted_at"
                mode="date"
                :masks="{ title: 'YYYY년 MMM', modelValue: 'YYYY-MM-DD' }"
                @dayclick="(day, event) => event.target.blur()"
              >
                <template #default="{ inputValue, inputEvents }">
                  <div class="input-box clickable" v-on="inputEvents">
                    <i class="fa-solid fa-calendar input-icon"></i>
                    <input
                      class="input-control no-border bold"
                      :value="inputValue"
                      readonly
                      placeholder="날짜 선택"
                    />
                  </div>
                </template>
              </DatePicker>
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
                  @input="filterNumber"
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

            <div class="form-group" v-if="formData.type === 'EXPENSE'">
              <label class="form-label">결제 수단</label>
              <div class="pills-container">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="pill-item"
                  :class="{ selected: method.code === formData.payment }"
                  @click="formData.payment = method.code"
                >
                  {{ method.name }}
                </div>
              </div>
            </div>

            <!-- <button class="add-btn" type="submit">추가하기</button> -->
            <button class="add-btn" type="submit">
              {{ addTransactionStore.isEditMode ? "수정하기" : "추가하기" }}
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
  border: 2px solid var(--color-border);
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
/* .modal.income {
  border: 2px solid var(--color-income);
}
.modal.expense {
  border: 2px solid var(--color-expense);
} */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #888e9c99;
  z-index: 998;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.bookmark-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.2s, background-color 0.2s;
}
.bookmark-btn:hover {
  background-color: var(--color-bg-light);
  color: var(--color-primary);
}
.bookmark-btn.active {
  color: var(--color-primary);
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
.input-control[type="number"]::-webkit-outer-spin-button,
.input-control[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-control[type="number"] {
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
  color: var(--color-bg-light);
  background-color: var(--color-expense);

  /* color: var(--color-expense); */
  /* border: 1px solid var(--color-expense); */
}
.toggle-item.income.selected {
  color: var(--color-bg-light);
  background-color: var(--color-income);

  /* color: var(--color-income); */
  /* border: 1px solid var(--color-income); */
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
