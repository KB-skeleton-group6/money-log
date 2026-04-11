<script setup>
import { computed } from 'vue';

const PAGE_GROUP_SIZE = 10;

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(['update:currentPage']);

const startPage = computed(
  () => Math.floor((props.currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1,
);

const endPage = computed(() => {
  const end = startPage.value + PAGE_GROUP_SIZE - 1;
  return end > props.totalPages ? props.totalPages : end;
});

const pageNumbers = computed(() => {
  const nums = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    nums.push(i);
  }
  return nums;
});

const go = (page) => emit('update:currentPage', page);
</script>

<template>
  <div class="pagination" v-if="totalPages > 0">
    <button
      :disabled="currentPage === 1"
      @click="go(1)"
      class="page-btn"
      title="처음으로"
    >
      <i class="fas fa-angle-double-left"></i>
    </button>

    <button
      :disabled="currentPage === 1"
      @click="go(currentPage - 1)"
      class="page-btn"
      title="이전"
    >
      <i class="fas fa-angle-left"></i>
    </button>

    <button
      v-for="page in pageNumbers"
      :key="page"
      @click="go(page)"
      :class="['page-btn', { active: currentPage === page }]"
    >
      {{ page }}
    </button>

    <button
      :disabled="currentPage === totalPages"
      @click="go(currentPage + 1)"
      class="page-btn"
      title="다음"
    >
      <i class="fas fa-angle-right"></i>
    </button>

    <button
      :disabled="currentPage === totalPages"
      @click="go(totalPages)"
      class="page-btn"
      title="끝으로"
    >
      <i class="fas fa-angle-double-right"></i>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 30px;
  padding-bottom: 40px;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  border: none;
  background-color: transparent;
  color: #718096;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) {
  background-color: transparent;
  color: #1a202c;
}
.page-btn.active {
  color: #1a202c;
  font-weight: 800;
  border-bottom: 3px solid #1a202c;
}
.page-btn:disabled {
  color: #edf2f7;
  cursor: not-allowed;
}
</style>
