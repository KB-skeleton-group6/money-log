import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axiosClient from '@/api/axiosClient';
import { useAuthStore } from '../auth/useAuthStore';

export const useTransactionStore = defineStore('transaction', () => {
  // state
  const transactions = ref([]);
  const categories = ref([]);
  const loading = ref(false);

  // getters
  const getDateInfo = computed(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  });

  // 날짜 필터링 헬퍼 함수
  const filterByMonthYear = (list, targetMonth, targetYear) => {
    return list.filter((t) => {
      const d = new Date(t.transacted_at);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });
  };

  // 이번 달 거래 내역
  const thisMonthTransactions = computed(() => {
    const { month, year } = getDateInfo.value;
    return filterByMonthYear(transactions.value, month, year);
  });

  // 지난달 거래 내역
  const lastMonthTransactions = computed(() => {
    const { month, year } = getDateInfo.value;
    const lastM = month === 0 ? 11 : month - 1;
    const lastY = month === 0 ? year - 1 : year;
    return filterByMonthYear(transactions.value, lastM, lastY);
  });

  // 요약 데이터 계산용 헬퍼
  const summaryStats = computed(() => {
    const calculateTotal = (list, type) =>
      list.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);

    const tMonth = thisMonthTransactions.value;
    const lMonth = lastMonthTransactions.value;

    const stats = {
      income: {
        current: calculateTotal(tMonth, 'INCOME'),
        last: calculateTotal(lMonth, 'INCOME'),
      },
      expense: {
        current: calculateTotal(tMonth, 'EXPENSE'),
        last: calculateTotal(lMonth, 'EXPENSE'),
      },
    };

    const calculateDiff = (curr, last) =>
      last === 0 ? 0 : (((curr - last) / last) * 100).toFixed(1);

    return {
      totalIncome: stats.income.current,
      incomeDiff: calculateDiff(stats.income.current, stats.income.last),
      totalExpense: stats.expense.current,
      expenseDiff: calculateDiff(stats.expense.current, stats.expense.last),
      totalProfit: stats.income.current - stats.expense.current,
      profitDiff: calculateDiff(
        stats.income.current - stats.expense.current,
        stats.income.last - stats.expense.last,
      ),
    };
  });

  // actions
  async function fetchData(userId = 'user01') {
    loading.value = true;
    try {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        transactions.value = [];
        categories.value = []; // 로그아웃 시 카테고리도 초기화
        return;
      }
      const userId = authStore.user.id;

      // Promise.all을 사용하여 트랜잭션과 카테고리 데이터를 병렬로 가져옴
      const [transactionsData, categoriesData] = await Promise.all([
        axiosClient.transactionApi.getTransactionsByUserId(userId),
        axiosClient.categoryApi.getCategories(),
      ]);

      transactions.value = transactionsData;
      categories.value = categoriesData;
    } catch (error) {
      console.error('Data Fetch Error:', error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteTransaction(id) {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      const backup = transactions.value[index];
      transactions.value.splice(index, 1);

      try {
        await axiosClient.transactionApi.deleteTransaction(id);
      } catch (error) {
        transactions.value.splice(index, 0, backup);
        alert('삭제에 실패했습니다.');
      }
    }
  }

  async function addTransaction(payload) {
    try {
      const newTransaction =
        await axiosClient.transactionApi.createTransaction(payload);

      if (newTransaction) {
        transactions.value.push(newTransaction);
      } else {
        await fetchData();
      }
      return true;
    } catch (error) {
      console.error('거래 추가 실패:', error);
      alert('거래 내역을 추가하는데 실패했습니다.');
      return false;
    }
  }
  async function updateTransaction(id, payload) {
    try {
      // 1. 서버에 수정 요청 (axiosClient를 통해 PUT/PATCH 호출)
      const updatedData = await axiosClient.transactionApi.updateTransaction(
        id,
        payload,
      );

      if (updatedData) {
        // 2. 내 로컬 데이터(배열)에서 해당 항목을 찾아 업데이트
        const index = transactions.value.findIndex((t) => t.id === id);
        if (index !== -1) {
          transactions.value[index] = updatedData;
        }
      } else {
        // 만약 응답값이 명확하지 않다면 전체 데이터를 다시 불러오기
        await fetchData();
      }
      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('거래 수정 실패:', error);
      alert('거래 내역을 수정하는데 실패했습니다.');
      return false; // 실패 시 false 반환
    }
  }

  return {
    transactions,
    categories,
    loading,
    getDateInfo,
    thisMonthTransactions,
    lastMonthTransactions,
    summaryStats,
    fetchData,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  };
});
