<script setup>
import { computed, ref, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';
import { useTransactionTemplateStore } from '@/stores/transactions/useTransactionTemplateStore';
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
  confirmingItem.value = null;
  displayLimit.value = 5;
  activeTab.value = 'recent';
  emit('close');
};

const store = useTransactionStore();
const categoryStore = useCategoryStore();
const templateStore = useTransactionTemplateStore();
const { transactions } = storeToRefs(store);
const { templates } = storeToRefs(templateStore);

const activeTab = ref('recent');
const confirmingItem = ref(null);
const displayLimit = ref(5);

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) templateStore.fetchTemplates();
});

const recentTransactions = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return [];
  return [...transactions.value]
    .sort((a, b) => new Date(b.transacted_at) - new Date(a.transacted_at))
    .slice(0, displayLimit.value);
});

const hasMore = computed(() => {
  return transactions.value && transactions.value.length > displayLimit.value;
});

const getCategory = (id) => categoryStore.getCategoryById(id) ?? {};

const handleItemClick = (item) => {
  confirmingItem.value = item;
};

const handleTemplateDelete = async (e, templateId) => {
  e.stopPropagation();
  await templateStore.removeTemplate(templateId);
};

const loadMore = () => {
  displayLimit.value += 5;
};

const proceedAdd = async () => {
  if (!confirmingItem.value) return;

  const payload = {
    type: confirmingItem.value.type,
    amount: confirmingItem.value.amount,
    category_id: confirmingItem.value.category_id,
    detail: confirmingItem.value.detail,
    memo: confirmingItem.value.memo ?? '',
    payment: confirmingItem.value.payment ?? null,
    transacted_at: new Date().toISOString(),
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

        <!-- 탭 -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'recent' }"
            @click="activeTab = 'recent'; confirmingItem = null"
          >
            <i class="fa-solid fa-clock-rotate-left"></i> 최근 거래
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'saved' }"
            @click="activeTab = 'saved'; confirmingItem = null"
          >
            <i class="fa-solid fa-bookmark"></i> 저장 거래
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

          <!-- 최근 거래 탭 -->
          <template v-else-if="activeTab === 'recent'">
            <div v-if="recentTransactions.length > 0" class="recent-list-container">
              <ul class="recent-list">
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
                    <i :class="getCategory(item.category_id).icon || 'fa-solid fa-tag'"></i>
                  </div>
                  <div class="item-info">
                    <span class="item-desc">{{ item.detail || '내역 없음' }}</span>
                    <span class="item-category">{{ getCategory(item.category_id).name || '기타' }}</span>
                  </div>
                  <div class="item-amount" :class="item.type.toLowerCase()">
                    {{ item.type === 'EXPENSE' ? '-' : '+' }}{{ formatAmount(Math.abs(item.amount)) }}원
                  </div>
                </li>
              </ul>
              <div v-if="hasMore" class="load-more-container">
                <button class="btn-load-more" @click="loadMore">
                  더보기 <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <div v-else class="empty-placeholder">
              <i class="fa-regular fa-clock"></i>
              <p>최근 거래 내역이 아직 없습니다.</p>
            </div>
          </template>

          <!-- 저장 거래 탭 -->
          <template v-else-if="activeTab === 'saved'">
            <div v-if="templateStore.loading" class="empty-placeholder">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <p>불러오는 중...</p>
            </div>
            <div v-else-if="templates.length > 0" class="recent-list-container">
              <ul class="recent-list">
                <li
                  v-for="template in templates"
                  :key="template.id"
                  class="recent-item"
                  @click="handleItemClick(template)"
                >
                  <div
                    class="item-icon"
                    :style="{
                      backgroundColor: getCategory(template.category_id).color + '1A',
                      color: getCategory(template.category_id).color,
                    }"
                  >
                    <i :class="getCategory(template.category_id).icon || 'fa-solid fa-tag'"></i>
                  </div>
                  <div class="item-info">
                    <span class="item-desc">{{ template.detail || '내역 없음' }}</span>
                    <span class="item-category">{{ getCategory(template.category_id).name || '기타' }}</span>
                  </div>
                  <div class="item-right">
                    <div class="item-amount" :class="template.type.toLowerCase()">
                      {{ template.type === 'EXPENSE' ? '-' : '+' }}{{ formatAmount(Math.abs(template.amount)) }}원
                    </div>
                    <button
                      class="template-delete-btn"
                      @click="handleTemplateDelete($event, template.id)"
                      title="삭제"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else class="empty-placeholder">
              <i class="fa-regular fa-bookmark"></i>
              <p>저장된 거래가 없습니다.</p>
              <span>거래 추가 시 북마크 버튼을 눌러 저장해보세요.</span>
            </div>
          </template>
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
  max-width: 560px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 32px;
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

/* 탭 바 */
.tab-bar {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}
.tab-btn {
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaa;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.tab-btn.active {
  color: #00bc7c;
  border-bottom-color: #00bc7c;
}
.tab-btn:hover:not(.active) {
  color: #555;
}

.modal-body {
  padding: 28px 32px;
  min-height: 240px;
  max-height: 65vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.recent-list-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.load-more-container {
  text-align: center;
  margin-top: 16px;
  padding-bottom: 8px;
}

.btn-load-more {
  background: #f1f2f6;
  color: #747d8c;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-load-more:hover {
  background: #dfe4ea;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 14px;
  margin: 0 -14px;
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
  flex-shrink: 0;
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
  min-width: 0;
}
.item-category {
  font-size: 0.85rem;
  color: #888;
}
.item-desc {
  font-size: 1.05rem;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
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
.template-delete-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.2s, background-color 0.2s;
}
.template-delete-btn:hover {
  color: #ea5455;
  background-color: #fff0f0;
}

.empty-placeholder {
  text-align: center;
  color: #999;
  margin: auto 0;
  padding: 24px 0;
}

.empty-placeholder i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 12px;
  display: inline-block;
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
  margin: auto 0;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 반응형 모바일 크기 조정 */
@media (max-width: 600px) {
  .modal-content {
    width: 95%;
  }
  .modal-header {
    padding: 16px 20px;
  }
  .modal-header h3 {
    font-size: 1.1rem;
  }
  .modal-body {
    padding: 16px 20px;
  }
  .recent-item {
    padding: 12px 8px;
    margin: 0 -8px;
    gap: 12px;
  }
  .item-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  .item-desc {
    font-size: 0.95rem;
  }
  .item-category {
    font-size: 0.8rem;
  }
  .item-amount {
    font-size: 0.95rem;
  }
  .confirm-icon {
    font-size: 2.5rem;
  }
  .confirm-view h4 {
    font-size: 1.05rem;
    margin-bottom: 16px;
  }
  .confirm-card {
    padding: 16px;
    margin-bottom: 16px;
  }
  .cc-detail {
    font-size: 1.05rem;
  }
  .cc-amount {
    font-size: 1.15rem;
  }
  .btn-cancel,
  .btn-submit {
    padding: 12px 0;
    font-size: 0.9rem;
  }
  .tab-btn {
    font-size: 0.85rem;
    padding: 10px 0;
  }
}
</style>
