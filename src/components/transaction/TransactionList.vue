<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';
import DeleteConfirmModal from '../../components/transaction/DeleteConfirmModal.vue';
import { useAddTransactionStore } from '@/stores/transactions/useAddTransactionStore';

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['edit', 'delete']);

const { categories } = storeToRefs(useCategoryStore());
const getCat = (id) => categories.value.find((c) => c.id === id) ?? { name: '미분류', color: '#888', subColor: '#eee', icon: 'fa-solid fa-question' };

// 데이터 그룹화 및 가공
const groupedTransactions = computed(() => {
  const groups = {};

  props.transactions.forEach((tx) => {
    const dateObj = new Date(tx.transacted_at);
    // YYYY-MM-DD 형식
    const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    // 24시간 형식 표기 (getHours는 0~23을 반환)
    const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    if (!groups[dateKey])
      groups[dateKey] = { date: dateKey, items: [], income: 0, expense: 0 };
    groups[dateKey].items.push({ ...tx, displayTime: timeStr });

    if (tx.type === 'INCOME') groups[dateKey].income += tx.amount;
    if (tx.type === 'EXPENSE') groups[dateKey].expense += tx.amount;
  });

  // 1. 날짜별 그룹 정렬 (최신 날짜가 위로)
  const sortedGroups = Object.values(groups).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // 2. 각 날짜 그룹 내부의 아이템들을 이름순으로 정렬
  sortedGroups.forEach((group) => {
    group.items.sort((a, b) => a.detail.localeCompare(b.detail));
  });

  return sortedGroups;
});

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);

// 포맷팅 함수
const formatAmount = (amt, type) => {
  const formatted = new Intl.NumberFormat('ko-KR').format(amt);
  return type === 'INCOME' ? `+${formatted}원` : `-${formatted}원`;
};
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][d.getDay()]})`;
};

// 삭제 모달 관련 로직
const isDeleteModalOpen = ref(false);
const targetIdToDelete = ref(null);

const handleOpenDeleteModal = (id) => {
  targetIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};
const handleCloseDeleteModal = () => {
  isDeleteModalOpen.value = false;
  targetIdToDelete.value = null;
};
const executeDelete = () => {
  emit('delete', targetIdToDelete.value); // 부모에게 최종 삭제 요청
  handleCloseDeleteModal();
};

const updateTransactionStore = useAddTransactionStore();
const handleEditClick = (item) => {
  console.log('수정 버튼 눌림! 데이터:', item);
  updateTransactionStore.openEditModal(item);
};
</script>
<template>
  <div class="transaction-container">
    <div class="list-header pc-only">
      <span class="col-detail">상세 내용</span>
      <span class="col-category">카테고리</span>
      <span class="col-date">날짜</span>
      <span class="col-amount">금액</span>
      <span class="col-action">관리</span>
    </div>

    <div
      v-for="group in groupedTransactions"
      :key="group.date"
      class="date-group"
    >
      <div class="date-header">
        <span class="date-text">{{ formatDate(group.date) }}</span>
        <div class="date-summary">
          <span v-if="group.income > 0" class="text-blue"
            >+{{ formatCurrency(group.income) }}원</span
          >
          <span v-if="group.expense > 0" class="text-red"
            >-{{ formatCurrency(group.expense) }}원</span
          >
        </div>
      </div>

      <div v-for="item in group.items" :key="item.id" class="transaction-item">
        <div class="col-detail detail-wrap">
          <div
            class="item-icon"
            :style="{
              color: getCat(item.category_id).color,
              backgroundColor: getCat(item.category_id).subColor,
            }"
          >
            <i :class="getCat(item.category_id).icon"></i>
          </div>
          <div class="item-info">
            <div class="item-title">{{ item.detail }}</div>
            <div class="item-memo" v-if="item.memo">{{ item.memo }}</div>
          </div>
        </div>

        <div class="col-category">
          <span
            class="category-tag"
            :style="{
              color: getCat(item.category_id).color,
              backgroundColor: getCat(item.category_id).subColor,
            }"
          >
            {{ getCat(item.category_id).name }}
          </span>
        </div>

        <div class="col-date time-text pc-only">
          <i class="far fa-clock"></i> {{ group.date }}
        </div>

        <div
          class="col-amount amount-text"
          :class="item.type === 'INCOME' ? 'text-blue' : 'text-red'"
        >
          {{ formatAmount(item.amount, item.type) }}
        </div>

        <div class="col-action">
          <button
            class="action-btn"
            @click="handleEditClick(item)"
            title="수정"
          >
            <i class="far fa-edit"></i>
          </button>
          <button
            class="action-btn"
            @click="handleOpenDeleteModal(item.id)"
            title="삭제"
          >
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 데이터가 없을 때 표시할 UI -->
    <div v-if="groupedTransactions.length === 0" class="empty-msg">
      <i class="fa-regular fa-folder-open"></i>
      <p>데이터가 없습니다.</p>
    </div>

    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      @cancel="handleCloseDeleteModal"
      @confirm="executeDelete"
    />
  </div>
</template>
<style scoped>
.transaction-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 0 24px 24px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  position: relative;
}
.list-header,
.transaction-item {
  display: flex;
  align-items: center;
}
.col-detail {
  flex: 3;
}
.col-category {
  flex: 1.5;
  text-align: center;
}
.col-date {
  flex: 2;
  text-align: center;
}
.col-amount {
  flex: 1.5;
  text-align: right;
}
.col-action {
  flex: 1;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.list-header {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #888;
}
.date-group {
  margin-top: 24px;
}
.date-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f9f9f9;
}
.date-summary span {
  margin-left: 12px;
  font-size: 14px;
  font-weight: 700;
}
.transaction-item {
  padding: 16px 0;
  border-bottom: 1px solid #f9f9f9;
}
.transaction-item:last-child {
  border-bottom: none;
}
.detail-wrap {
  display: flex;
  align-items: center;
}
.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 18px;
}
.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-title {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}
.item-memo {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.category-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.time-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0abbc;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.time-text i {
  margin-right: 6px;
  font-size: 14px;
  color: #b0bccd;
}
.amount-text {
  font-weight: 700;
  font-size: 15px;
}
.action-btn {
  width: 36px;
  height: 36px;
  background-color: #ffffff;
  border: 1.5px solid #eef2f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #a0aec0;
  font-size: 15px;
  transition: all 0.2s ease;
}
.action-btn:hover {
  border-color: #cbd5e1;
  color: #64748b;
  background-color: #f8fafc;
}
.text-blue {
  color: #00b0ff;
}
.text-red {
  color: #ff5252;
}

/* 빈 데이터 안내 메시지 스타일 (Statistic과 동일한 느낌) */
.empty-msg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #999;
  padding: 80px 0;
}
.empty-msg i {
  font-size: 3rem;
  color: #ddd;
}
.empty-msg p {
  margin: 0;
  font-size: 1rem;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .pc-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }

  .transaction-container {
    padding: 0 16px 16px 16px; /* 모바일에서 여백 살짝 축소 */
  }

  /* 1. 리스트 아이템을 카드 형태로 변경 */
  .transaction-item {
    display: grid;
    grid-template-areas: 'detail amount action'; /* 완벽한 1줄 배치로 변경 */
    grid-template-columns: 1fr auto auto;
    gap: 8px;
    padding: 12px 0;
    align-items: center;
  }

  /* 2. 각 구역 배치 설정 */
  .col-detail {
    grid-area: detail;
    width: 100%;
  }

  .col-amount {
    grid-area: amount;
    width: auto;
    font-size: 16px;
  }

  .col-category {
    display: none; /* 모바일 화면에서는 카테고리 숨김 */
  }

  .col-action {
    grid-area: action;
    justify-content: flex-end;
  }

  /* 상세 내용(디테일)과 메모를 양옆으로 나란히 배치 */
  .item-info {
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .item-memo {
    display: none; /* 모바일에서 메모 숨김 */
  }

  /* 3. 모바일 전용 폰트 스타일 */
  .mobile-date {
    font-size: 12px;
    color: #a0abbc;
    margin-top: 2px;
  }

  .item-title {
    font-size: 16px; /* 상세내용 글씨 크기 확대 */
    font-weight: 700; /* 조금 더 또렷하게 보이도록 굵기 추가 (선택사항) */
  }

  .category-tag {
    padding: 4px 10px;
    font-size: 11px;
  }

  .date-header {
    font-size: 14px; /* 글자 크기 살짝 키움 */
    padding: 16px 4px; /* 위아래 여백을 대폭 늘려 칸을 넓힘 */
    margin-bottom: 8px;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
