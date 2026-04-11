<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "@/stores/categories/useCategoryStore";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:filters"]);

const { categories } = storeToRefs(useCategoryStore());

const filteredCategories = computed(() => {
  if (!props.filters.type) return categories.value;
  return categories.value.filter((cat) => cat.type === props.filters.type);
});

const update = (key, value) => {
  emit("update:filters", { ...props.filters, [key]: value });
};

const reset = () => {
  emit("update:filters", {
    startDate: "",
    endDate: "",
    categoryId: "",
    type: "",
    keyword: "",
  });
};

// 분류 변경 시 해당 분류에 속하지 않는 카테고리가 선택된 경우 초기화
watch(
  () => props.filters.type,
  (newType) => {
    if (!newType) return;
    const selected = categories.value.find(
      (cat) => cat.id === props.filters.categoryId,
    );
    if (selected && selected.type !== newType) {
      emit("update:filters", {
        ...props.filters,
        type: newType,
        categoryId: "",
      });
    }
  },
);
</script>

<template>
  <section class="filter-section">
    <div class="filter-row">
      <div class="filter-group">
        <label>시작일</label>
        <input
          type="date"
          :value="filters.startDate"
          @change="update('startDate', $event.target.value)"
          class="filter-input"
        />
      </div>
      <div class="filter-group">
        <label>종료일</label>
        <input
          type="date"
          :value="filters.endDate"
          @change="update('endDate', $event.target.value)"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label>분류</label>
        <select
          :value="filters.type"
          @change="update('type', $event.target.value)"
          class="filter-input"
        >
          <option value="">전체</option>
          <option value="INCOME">수입</option>
          <option value="EXPENSE">지출</option>
        </select>
      </div>

      <div class="filter-group">
        <label>카테고리</label>
        <select
          :value="filters.categoryId"
          @change="update('categoryId', $event.target.value)"
          class="filter-input"
        >
          <option value="">전체</option>
          <option
            v-for="cat in filteredCategories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="filter-group search-group">
        <label>항목</label>
        <input
          type="text"
          :value="filters.keyword"
          @input="update('keyword', $event.target.value)"
          placeholder="거래 항목 검색"
          class="filter-input"
        />
      </div>

      <button class="reset-btn" @click="reset" title="필터 초기화">
        <i class="fas fa-rotate-left"></i> 초기화
      </button>
    </div>
  </section>
</template>

<style scoped>
.filter-section {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
}
.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
}
.filter-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  min-width: 140px;
  transition: border-color 0.2s;
}
.filter-input:focus {
  border-color: #00c853;
}
.search-group {
  min-width: 200px;
  max-width: 240px;
}
.reset-btn {
  align-self: flex-end;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  height: 41px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition:
    background-color 0.2s,
    color 0.2s;
  white-space: nowrap;
}
.reset-btn:hover {
  background-color: #e2e8f0;
  color: #334155;
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
    margin-bottom: 16px;
    border: none;
  }

  .filter-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .search-group {
    grid-column: span 2;
    max-width: none;
  }

  .reset-btn {
    grid-column: span 2;
    justify-content: center;
    width: 100%;
    height: 40px;
  }

  .filter-group label {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .filter-group {
    min-width: 0;
  }

  .filter-input {
    padding: 8px 12px;
    font-size: 13px;
    height: 40px;
    min-width: 0;
    width: 100%;
  }
}
</style>
