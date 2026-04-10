import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./auth/useAuthStore";

export const useTransactionStore = defineStore("transaction", () => {
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

  // 이번 달 거래 내역
  const thisMonthTransactions = computed(() => {
    const { month, year } = getDateInfo.value;
    return transactions.value.filter((t) => {
      const d = new Date(t.transacted_at);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  });

  // 지난달 거래 내역
  const lastMonthTransactions = computed(() => {
    const { month, year } = getDateInfo.value;
    const lastM = month === 0 ? 11 : month - 1;
    const lastY = month === 0 ? year - 1 : year;
    return transactions.value.filter((t) => {
      const d = new Date(t.transacted_at);
      return d.getMonth() === lastM && d.getFullYear() === lastY;
    });
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
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        transactions.value = [];
        return;
      }
      const userId = authStore.user.id;

      const transactionsData =
        await axiosClient.transactionApi.getTransactionsByUserId(userId);
      console.log(transactionsData);

      transactions.value = transactionsData;
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
        await axiosClient.transactionApi.deleteTransaction(id);
      } catch (error) {
        transactions.value.splice(index, 0, backup);
        alert("삭제에 실패했습니다.");
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
      console.error("거래 추가 실패:", error);
      alert("거래 내역을 추가하는데 실패했습니다.");
      return false;
    }
  }
  async function editTransaction() {}

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
  };
});
