<script setup>
import { computed, ref } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';
import { storeToRefs } from 'pinia';
import { formatAmount } from '@/utils/formatter';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'success']);

const close = () => {
  confirmingItem.value = null; // 모달 닫을 때 상태 초기화
  emit('close');
};

const store = useTransactionStore();
const { transactions } = storeToRefs(store);
const { getCategoryById } = useCategoryStore();

const confirmingItem = ref(null);

const recentTransactions = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return [];
  return [...transactions.value]
    .sort((a, b) => new Date(b.transacted_at) - new Date(a.transacted_at))
    .slice(0, 3);
});

const getCategory = (id) => getCategoryById(id) ?? {};

const handleItemClick = (item) => {
  confirmingItem.value = item;
};

const proceedAdd = async () => {
  if (!confirmingItem.value) return;

  const payload = {
    type: confirmingItem.value.type,
    amount: confirmingItem.value.amount,
    category_id: confirmingItem.value.category_id,
    detail: confirmingItem.value.detail,
    transacted_at: new Date().toISOString(), // 날짜/시간은 현재 시점으로 갱신
  };

  const success = await store.addTransaction(payload);
  if (success) {
    emit('success');
    close();
  }
};
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>⚡️ 빠른 추가</h3>
          <button class="close-btn" @click="close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 자체 확인(Confirm) 화면 -->
          <div v-if="confirmingItem" class="confirm-view">
            <div class="confirm-icon">
              <i class="fa-regular fa-circle-question"></i>
            </div>
            <h4>해당 내역을 바로 추가할까요?</h4>
            <div class="confirm-card">
              <div class="cc-detail">
                {{ confirmingItem.detail || '내역 없음' }}
              </div>
              <div class="cc-category">
                {{ getCategory(confirmingItem.category_id).name || '기타' }}
              </div>
              <div class="cc-amount" :class="confirmingItem.type.toLowerCase()">
                {{ confirmingItem.type === 'EXPENSE' ? '-' : '+'
                }}{{ formatAmount(Math.abs(confirmingItem.amount)) }}원
              </div>
            </div>
            <div class="confirm-actions">
              <button class="btn-cancel" @click="confirmingItem = null">
                취소
              </button>
              <button class="btn-submit" @click="proceedAdd">추가하기</button>
            </div>
          </div>

          <!-- 최근 내역 리스트 -->
          <ul v-else-if="recentTransactions.length > 0" class="recent-list">
            <li
              v-for="item in recentTransactions"
              :key="item.id"
              class="recent-item"
              @click="handleItemClick(item)"
            >
              <div
                class="item-icon"
                :style="{
                  backgroundColor: getCategory(item.category_id).color + '1A',
                  color: getCategory(item.category_id).color,
                }"
              >
                <i
                  :class="
                    getCategory(item.category_id).icon || 'fa-solid fa-tag'
                  "
                ></i>
              </div>
              <div class="item-info">
                <span class="item-desc">{{ item.detail || '내역 없음' }}</span>
                <span class="item-category">{{
                  getCategory(item.category_id).name || '기타'
                }}</span>
              </div>
              <div class="item-amount" :class="item.type.toLowerCase()">
                {{ item.type === 'EXPENSE' ? '-' : '+'
                }}{{ formatAmount(Math.abs(item.amount)) }}원
              </div>
            </li>
          </ul>

          <!-- 내역이 없을 때 -->
          <div v-else class="empty-placeholder">
            <i class="fa-regular fa-clock"></i>
            <p>최근 거래 내역이 아직 없습니다.</p>
            <span>자주 쓰는 내역을 여기에 보여드릴 예정입니다.</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 12px;
  margin: 0 -12px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}
.recent-item:last-child {
  border-bottom: none;
}
.recent-item:hover {
  background-color: #f9f9f9;
}
.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.item-category {
  font-size: 0.85rem;
  color: #888;
}
.item-desc {
  font-size: 1.05rem;
  color: #333;
  font-weight: 600;
}
.item-amount {
  font-weight: 700;
  font-size: 1.05rem;
}
.item-amount.expense {
  color: #ea5455;
}
.item-amount.income {
  color: #00cfe8;
}

.empty-placeholder {
  text-align: center;
  color: #999;
}

.empty-placeholder i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 12px;
}

.empty-placeholder p {
  margin: 0 0 8px 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #555;
}

.empty-placeholder span {
  font-size: 0.9rem;
}

/* 자체 확인(Confirm) 모달 스타일 */
.confirm-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.2s ease-out;
}
.confirm-icon {
  font-size: 3rem;
  color: #00bc7c;
  margin-bottom: 12px;
}
.confirm-view h4 {
  margin: 0 0 20px 0;
  font-size: 1.15rem;
  color: #333;
}
.confirm-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  margin-bottom: 24px;
  box-sizing: border-box;
}
.cc-detail {
  font-weight: 700;
  font-size: 1.15rem;
  color: #333;
  margin-bottom: 6px;
}
.cc-category {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 16px;
}
.cc-amount {
  font-weight: 700;
  font-size: 1.3rem;
}
.cc-amount.expense {
  color: #ea5455;
}
.cc-amount.income {
  color: #00cfe8;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}
.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-cancel {
  background: #f1f2f6;
  color: #747d8c;
}
.btn-cancel:hover {
  background: #dfe4ea;
}
.btn-submit {
  background: #00bc7c;
  color: white;
}
.btn-submit:hover {
  background: #00a86b;
}

/* 트랜지션 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
