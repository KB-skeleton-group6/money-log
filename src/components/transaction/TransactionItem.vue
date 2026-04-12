<script setup>
import { ref } from "vue";
import { useCategoryStore } from "@/stores/categories/useCategoryStore";
import { useAddTransactionStore } from "@/stores/transactions/useAddTransactionStore";
import { usePaymentMethodStore } from "@/stores/payments/usePaymentMethodStore";
import { formatAmountShort } from "@/utils/formatter";

const props = defineProps({
  item: { type: Object, required: true },
  date: { type: String, required: true },
});
const emit = defineEmits(["request-delete"]);

const { getCategoryById } = useCategoryStore();
const { getPaymentMethodByCode } = usePaymentMethodStore();
const getCat = (id) => getCategoryById(id);

const { openEditModal } = useAddTransactionStore();

const isExpanded = ref(false);

const formatAmountDisplay = (amt) =>
  amt >= 100_000_000
    ? formatAmountShort(amt)
    : new Intl.NumberFormat("ko-KR").format(amt) + "원";

const formatAmount = (amt, type) => {
  const formatted = formatAmountDisplay(Math.abs(amt));
  return type === "INCOME" ? `+${formatted}` : `-${formatted}`;
};
const formatAmountMobile = formatAmount;
const formatExpandDate = (dateStr, time) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${time}`;
};

const getPayment = (method) => getPaymentMethodByCode(method);
</script>

<template>
  <div class="transaction-item">
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
      <i class="far fa-clock"></i> {{ date }}
    </div>

    <div
      class="col-amount amount-text"
      :class="item.type === 'INCOME' ? 'text-blue' : 'text-red'"
    >
      <span class="pc-only">{{ formatAmount(item.amount, item.type) }}</span>
      <span class="mobile-only">{{
        formatAmountMobile(item.amount, item.type)
      }}</span>
    </div>

    <div class="col-action">
      <button
        class="action-btn pc-only"
        @click="openEditModal(item)"
        title="수정"
      >
        <i class="far fa-edit"></i>
      </button>
      <button
        class="action-btn pc-only"
        @click="emit('request-delete', item.id)"
        title="삭제"
      >
        <i class="far fa-trash-alt"></i>
      </button>
      <button
        class="action-btn mobile-only toggle-btn"
        @click="isExpanded = !isExpanded"
        :class="{ open: isExpanded }"
      >
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>

    <transition name="slide-down">
      <div v-if="isExpanded" class="item-expanded mobile-only">
        <div class="expand-info">
          <div class="expand-row">
            <span class="expand-label">카테고리</span>
            <span
              class="expand-category-tag"
              :style="{
                color: getCat(item.category_id).color,
                backgroundColor: getCat(item.category_id).subColor,
              }"
            >
              <i :class="getCat(item.category_id).icon"></i>
              {{ getCat(item.category_id).name }}
            </span>
          </div>
          <div class="expand-row">
            <span class="expand-label">날짜</span>
            <span class="expand-value">{{
              formatExpandDate(date, item.displayTime)
            }}</span>
          </div>
          <div class="expand-row">
            <span class="expand-label">금액</span>
            <span
              class="expand-value"
              :class="item.type === 'INCOME' ? 'text-blue' : 'text-red'"
            >
              {{ formatAmount(item.amount, item.type) }}
            </span>
          </div>
          <div class="expand-row" v-if="item.payment">
            <span class="expand-label">결제수단</span>
            <span class="expand-value">
              <i
                :class="getPayment(item.payment)?.icon"
                :style="{ color: getPayment(item.payment)?.color }"
              ></i>
              {{ getPayment(item.payment)?.name ?? item.payment }}
            </span>
          </div>
          <div class="expand-row" v-if="item.memo">
            <span class="expand-label">메모</span>
            <span class="expand-value memo-value">{{ item.memo }}</span>
          </div>
        </div>
        <div class="expand-actions">
          <button class="expand-action-btn edit" @click="openEditModal(item)">
            <i class="far fa-edit"></i> 수정
          </button>
          <button
            class="expand-action-btn delete"
            @click="emit('request-delete', item.id)"
          >
            <i class="far fa-trash-alt"></i> 삭제
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f9f9f9;
}
.transaction-item:last-child {
  border-bottom: none;
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

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .pc-only {
    display: none;
  }
  .mobile-only {
    display: inline;
  }

  .transaction-item {
    display: grid;
    grid-template-areas:
      "detail amount action"
      "expanded expanded expanded";
    grid-template-columns: 1fr 140px auto;
    gap: 0;
    padding: 12px 0;
    align-items: center;
  }

  .col-detail {
    grid-area: detail;
    min-width: 0;
  }
  .col-amount {
    grid-area: amount;
    font-size: 16px;
    text-align: right;
    word-break: break-all;
  }
  .col-category {
    display: none;
  }
  .col-action {
    grid-area: action;
    justify-content: flex-end;
  }

  .detail-wrap {
    min-width: 0;
  }

  .item-info {
    flex-direction: row;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }
  .item-memo {
    display: none;
  }
  .item-title {
    font-size: 16px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .category-tag {
    padding: 4px 10px;
    font-size: 11px;
  }

  .toggle-btn {
    display: flex;
    background: none;
    border: none;
    box-shadow: none;
    padding: 4px;
    width: auto;
    height: auto;
    color: #94a3b8;
    font-size: 12px;
  }
  .toggle-btn i {
    transition: transform 0.2s ease;
  }
  .toggle-btn.open i {
    transform: rotate(180deg);
  }

  .item-expanded {
    grid-area: expanded;
    margin-top: 10px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }

  .expand-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  .expand-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }
  .expand-label {
    width: 56px;
    flex-shrink: 0;
    color: #94a3b8;
    font-size: 12px;
  }
  .expand-value {
    color: #334155;
    font-weight: 500;
  }
  .expand-value i {
    margin-right: 4px;
  }
  .memo-value {
    color: #64748b;
    font-style: italic;
  }

  .expand-category-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .expand-category-tag i {
    font-size: 11px;
  }

  .expand-actions {
    display: flex;
    gap: 8px;
  }
  .expand-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 0;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .expand-action-btn.edit {
    background: #f1f5f9;
    color: #475569;
  }
  .expand-action-btn.delete {
    background: #fff1f2;
    color: #ef4444;
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
  }
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    margin-top: 0;
  }
  .slide-down-enter-to,
  .slide-down-leave-from {
    opacity: 1;
    max-height: 60px;
  }
}
</style>
