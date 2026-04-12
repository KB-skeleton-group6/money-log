import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { transactionService } from "@/api/services/transactionService";

export const useTransactionStore = defineStore("transaction", () => {
  // state
  const transactions = ref([]);
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
        current: calculateTotal(tMonth, "INCOME"),
        last: calculateTotal(lMonth, "INCOME"),
      },
      expense: {
        current: calculateTotal(tMonth, "EXPENSE"),
        last: calculateTotal(lMonth, "EXPENSE"),
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
  async function fetchData() {
    loading.value = true;
    try {
      transactions.value = await transactionService.fetchAll();
    } catch (error) {
      console.error("Data Fetch Error:", error);
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
        await transactionService.remove(id);
      } catch (error) {
        transactions.value.splice(index, 0, backup);
        alert("삭제에 실패했습니다.");
      }
    }
  }

  async function addTransaction(payload) {
    try {
      const newTransaction = await transactionService.create(payload);

      if (newTransaction) {
        transactions.value = [...transactions.value, newTransaction].sort(
          (a, b) => new Date(b.transacted_at) - new Date(a.transacted_at),
        );
      } else {
        await fetchData();
      }
      return true;
    } catch (error) {
      console.error("거래 추가 실패:", error);
      alert("거래 내역을 추가하는데 실패했습니다.");
      return false;
    }
  }

  async function updateTransaction(id, payload) {
    try {
      const updatedData = await transactionService.update(id, payload);

      if (updatedData) {
        const index = transactions.value.findIndex((t) => t.id === id);
        if (index !== -1) {
          transactions.value[index] = updatedData;
        }
      } else {
        await fetchData();
      }
      return true;
    } catch (error) {
      console.error("거래 수정 실패:", error);
      alert("거래 내역을 수정하는데 실패했습니다.");
      return false;
    }
  }

  return {
    transactions,
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
