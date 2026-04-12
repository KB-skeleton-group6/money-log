<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { useTransactionStore } from "@/stores/transactions/useTransactionStore";
import DeleteConfirmModal from "@/components/transaction/DeleteConfirmModal.vue";
import TransactionItem from "@/components/transaction/TransactionItem.vue";

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});

const { deleteTransaction } = useTransactionStore();

// 데이터 그룹화
const groupedTransactions = computed(() => {
  const groups = {};

  props.transactions.forEach((tx) => {
    const dateObj = new Date(tx.transacted_at);
    const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

    if (!groups[dateKey])
      groups[dateKey] = { date: dateKey, items: [], income: 0, expense: 0 };
    groups[dateKey].items.push({ ...tx, displayTime: timeStr });

    if (tx.type === "INCOME") groups[dateKey].income += tx.amount;
    if (tx.type === "EXPENSE") groups[dateKey].expense += tx.amount;
  });

  const sortedGroups = Object.values(groups).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  sortedGroups.forEach((group) => {
    group.items.sort((a, b) => dayjs(b.transacted_at).diff(dayjs(a.transacted_at)));
  });

  return sortedGroups;
});

const formatCurrency = (val) => new Intl.NumberFormat("ko-KR").format(val);
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][d.getDay()]})`;
};

// 삭제 모달
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
  deleteTransaction(targetIdToDelete.value);
  handleCloseDeleteModal();
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

      <TransactionItem
        v-for="item in group.items"
        :key="item.id"
        :item="item"
        :date="group.date"
        @request-delete="handleOpenDeleteModal"
      />
    </div>

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
.list-header {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #888;
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
.text-blue {
  color: #00b0ff;
}
.text-red {
  color: #ff5252;
}

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

@media (max-width: 768px) {
  .pc-only {
    display: none;
  }

  .transaction-container {
    background: transparent;
    box-shadow: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .date-group {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 0 16px 8px;
    margin-top: 0;
  }

  .date-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 14px 0 10px;
    margin-bottom: 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .date-summary {
    display: flex;
    gap: 8px;
  }
  .date-summary span {
    font-size: 12px;
    font-weight: 600;
    margin-left: 0;
  }
}
</style>
