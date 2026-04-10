<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import TransactionList from '@/components/transaction/TransactionList.vue';
import TransactionAddModal from '@/components/transaction/TransactionAddModal.vue';
import { useAuthStore } from '@/stores/auth/useAuthStore';

// Pinia Store 연결
const transactionStore = useTransactionStore();
const authStore = useAuthStore();

// 데이터(ref)는 storeToRefs로 감싸서 꺼내야 화면이 실시간으로 바뀜
const { transactions, categories } = storeToRefs(transactionStore);

// 함수(액션)는 그냥 바로 꺼냅니다.
const { fetchData, deleteTransaction, updateTransaction } = transactionStore;

//로그인한 유저 정보
const { user } = storeToRefs(authStore);

// 화면 전용 상태 및 로직
// 필터 상태
const filters = ref({
  startDate: '',
  endDate: '',
  categoryId: '',
  type: '',
  keyword: '',
});

// 페이지네이션 관련 상태
const currentPage = ref(1); // 현재 페이지
const itemsPerPage = ref(10); // 한 페이지당 보여줄 개수 (원하는 대로 조절)
const PAGE_GROUP_SIZE = 10; // 한 번에 보여줄 페이지 번호 개수 (10개)

// 화면이 켜지면 스토어의 fetchData 함수를 실행
onMounted(() => {
  fetchData();
});

// 1. 필터링된 "전체" 데이터 (기존과 동일)
const allFilteredTransactions = computed(() => {
  const filtered = transactions.value.filter((tx) => {
    // 1. 날짜 필터 (한국 시간으로 변환 후 비교)
    const dateObj = new Date(tx.transacted_at);
    // YYYY-MM-DD 형태로 예쁘게 만들기 (input type="date"의 형식과 맞추기 위함)
    const txDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    if (filters.value.startDate && txDate < filters.value.startDate)
      return false;
    if (filters.value.endDate && txDate > filters.value.endDate) return false;

    // 2. 카테고리 필터
    if (filters.value.categoryId && tx.category_id !== filters.value.categoryId)
      return false;

    // 3. 수입/지출 필터
    if (filters.value.type && tx.type !== filters.value.type) return false;

    // 4. 검색어 필터 (상세내용 detail에 검색어가 포함되어 있는지 확인)
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase();
      const matchDetail = tx.detail?.toLowerCase().includes(keyword);
      if (!matchDetail) return false;
    }
    return true;
  });
  // 최신 날짜(시간)가 위로 오도록 정렬
  return filtered.sort((a, b) => {
    return new Date(b.transacted_at) - new Date(a.transacted_at);
  });
});

// 2. 현재 페이지에 보여줄 데이터 자르기
const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allFilteredTransactions.value.slice(start, end);
});

// 3. 페이지 번호 계산 (10개씩 끊기)
const totalPages = computed(() =>
  Math.ceil(allFilteredTransactions.value.length / itemsPerPage.value),
);

const startPage = computed(
  () =>
    Math.floor((currentPage.value - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1,
);

const endPage = computed(() => {
  let end = startPage.value + PAGE_GROUP_SIZE - 1;
  return end > totalPages.value ? totalPages.value : end;
});

const pageNumbers = computed(() => {
  const nums = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    nums.push(i);
  }
  return nums;
});

watch(
  filters,
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);

watch(user, (newUser) => {
  if (newUser) {
    fetchData(newUser.id); // 새 유저의 데이터를 가져와!
  } else {
    transactions.value = []; // 로그아웃했다면 데이터를 비워!
  }
});

// 걸러진 데이터로 합계 계산하기 (기존 로직 완벽히 동일)
const summary = computed(() => {
  let income = 0;
  let expense = 0;

  transactions.value.forEach((tx) => {
    const dateObj = new Date(tx.transacted_at);
    const txDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    // 날짜 조건만 확인
    let isDateValid = true;
    if (filters.value.startDate && txDate < filters.value.startDate)
      isDateValid = false;
    if (filters.value.endDate && txDate > filters.value.endDate)
      isDateValid = false;

    // 날짜 조건만 맞으면, 검색어나 카테고리에 상관없이 무조건 합산
    if (isDateValid) {
      if (tx.type === 'INCOME') income += tx.amount;
      if (tx.type === 'EXPENSE') expense += tx.amount;
    }
  });

  return {
    income,
    expense,
    net: income - expense,
    count: allFilteredTransactions.value.length, //필터링된 총 개수
  };
});

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);
</script>

<template>
  <div class="page-container">
    <section class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>시작일</label>
          <input type="date" v-model="filters.startDate" class="filter-input" />
        </div>
        <div class="filter-group">
          <label>종료일</label>
          <input type="date" v-model="filters.endDate" class="filter-input" />
        </div>

        <div class="filter-group">
          <label>분류</label>
          <select v-model="filters.type" class="filter-input">
            <option value="">전체</option>
            <option value="INCOME">수입</option>
            <option value="EXPENSE">지출</option>
          </select>
        </div>

        <div class="filter-group">
          <label>카테고리</label>
          <select v-model="filters.categoryId" class="filter-input">
            <option value="">전체</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label>항목</label>
          <div class="search-input-wrap">
            <input
              type="text"
              v-model="filters.keyword"
              placeholder="거래 항목 검색"
              class="filter-input"
            />
            <button class="search-btn">
              <i class="fas fa-search"></i> 조회
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="summary-section">
      <div class="summary-card">
        <div class="card-icon text-blue">
          <i class="fas fa-arrow-circle-down"></i>
        </div>
        <div class="card-info">
          <div class="card-title">총 수입</div>
          <div class="card-value text-blue">
            +{{ formatCurrency(summary.income) }}원
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon text-red">
          <i class="fas fa-arrow-circle-up"></i>
        </div>
        <div class="card-info">
          <div class="card-title">총 지출</div>
          <div class="card-value text-red">
            -{{ formatCurrency(summary.expense) }}원
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon text-green">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="card-info">
          <div class="card-title">순이익</div>
          <div class="card-value text-green">
            {{ formatCurrency(summary.net) }}원
          </div>
        </div>
      </div>

      <div class="summary-card mini-card">
        <div class="card-icon text-gray mobile-only">
          <i class="fas fa-file-alt"></i>
        </div>

        <div class="card-info">
          <div class="card-title">검색 결과</div>
          <div class="card-value">{{ summary.count }}건</div>
        </div>
      </div>
    </section>

    <TransactionList
      :transactions="pagedTransactions"
      :categories="categories"
      @delete="deleteTransaction"
      @edit="updateTransaction"
    />

    <div class="pagination" v-if="totalPages > 0">
      <button
        :disabled="currentPage === 1"
        @click="currentPage = 1"
        class="page-btn"
        title="처음으로"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>

      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="page-btn"
        title="이전"
      >
        <i class="fas fa-angle-left"></i>
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="currentPage = page"
        :class="['page-btn', { active: currentPage === page }]"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="page-btn"
        title="다음"
      >
        <i class="fas fa-angle-right"></i>
      </button>

      <button
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
        class="page-btn"
        title="끝으로"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
    <TransactionAddModal />
  </div>
</template>

<style scoped>
/* 페이지 전체 배경 */
.page-container {
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}
.page-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

/* 1. 필터 섹션 스타일 */
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

/* 검색바 & 버튼 영역 */
.search-group {
  flex: 1;
  min-width: 280px;
}
.search-input-wrap {
  display: flex;
  gap: 8px;
}
.search-input-wrap .filter-input {
  flex: 1;
}
.search-btn {
  background-color: #00c853;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}
.search-btn:hover {
  background-color: #00b34a;
}

/* 2. 요약 카드 섹션 스타일 */
.summary-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.summary-card {
  flex: 1;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  gap: 16px;
}
.mini-card {
  flex: 0.5;
  justify-content: center;
} /* 건수 카드는 조금 작게 */

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: #f8fafc;
}
.card-icon.text-blue {
  background-color: #eff6ff;
}
.card-icon.text-red {
  background-color: #fef2f2;
}
.card-icon.text-green {
  background-color: #f0fdf4;
}

.card-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 600;
}
.card-value {
  font-size: 20px;
  font-weight: 800;
}

/* 텍스트 색상 */
.text-blue {
  color: #3b82f6;
}
.text-red {
  color: #ef4444;
}
.text-green {
  color: #10b981;
}
/* 페이지 네이션 */
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
  border: 1px solid #e2e8f0;
  background-color: #fff;
  color: #718096;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.page-btn.active {
  color: #1a202c;
  font-weight: 800;
  border-bottom: 3px solid #1a202c; /* 강조 밑줄 */
  border-top: 1px solid #e2e8f0;
}

.page-btn:disabled {
  color: #edf2f7;
  cursor: not-allowed;
}
.mobile-only {
  display: none; /* PC에서는 기본적으로 숨김 */
}

@media (max-width: 768px) {
  .mobile-only {
    display: flex; /* 모바일 화면이 되면 다시 보이게 함 */
  }

  .page-container {
    padding: 12px;
    background-color: #f1f5f9; /* 배경색을 살짝 진하게 해서 카드를 돋보이게 */
  }

  /* 1. 필터 섹션 개선 */
  .filter-section {
    padding: 16px;
    margin-bottom: 16px;
    border: none;
  }

  .filter-row {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 시작일, 종료일을 한 줄에 */
    gap: 12px;
  }

  /* 항목(검색) 부분은 한 줄을 통째로 차지하게 */
  .search-group {
    grid-column: span 2;
  }

  .filter-group label {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .filter-input {
    padding: 8px 12px;
    font-size: 13px;
    height: 40px; /* 높이 통일 */
  }

  .summary-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }

  /* 수입/지출/순이익 카드 공통 */
  .summary-card {
    padding: 12px;
    flex-direction: row; /* 아이콘과 텍스트 가로 배치 */
    justify-content: flex-start;
    text-align: left;
    gap: 10px;
  }

  /* 💡 검색 결과 카드 최적화 */
  .mini-card {
    grid-column: span 1; /* 한 칸 차지 (순이익 옆) */
    margin-top: 0;
    display: flex;
    align-items: center; /* 세로 중앙 정렬 */
    background: #ffffff; /* 다른 카드와 동일하게 흰색 배경 */
    border: 1px solid #f1f5f9;
    gap: 10px;
  }

  /* 💡 검색 결과 아이콘 스타일 */
  .card-icon {
    width: 32px; /* 다른 카드보다 약간 작게 설정 */
    height: 32px;
    font-size: 14px;
    background-color: #f1f5f9; /* 배경색 연한 그레이 */
  }

  .text-gray {
    color: #94a3b8; /* 아이콘 색상은 차분한 그레이 */
  }

  /* 내부 텍스트 정렬 */
  .mini-card .card-info {
    flex-direction: column;
    align-items: flex-start; /* 텍스트는 왼쪽 정렬 */
    gap: 2px;
  }

  .mini-card .card-title {
    font-size: 11px;
    margin-bottom: 0;
  }

  .mini-card .card-value {
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
