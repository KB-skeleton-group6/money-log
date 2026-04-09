import { defineStore } from "pinia";
import axios from "axios";
import axiosClient from "@/api/axiosClient";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
    categories: [],
    loading: false,
  }),

  getters: {
    getDateInfo: () => {
      const now = new Date();
      return {
        month: now.getMonth(),
        year: now.getFullYear(),
      };
    },

    // 이번 달 거래 내역
    thisMonthTransactions: (state) => {
      const { month, year } = state.getDateInfo;
      return state.transactions.filter((t) => {
        const d = new Date(t.transacted_at);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    },

    // 지난달 거래 내역
    lastMonthTransactions: (state) => {
      const { month, year } = state.getDateInfo;
      const lastM = month === 0 ? 11 : month - 1;
      const lastY = month === 0 ? year - 1 : year;
      return state.transactions.filter((t) => {
        const d = new Date(t.transacted_at);
        return d.getMonth() === lastM && d.getFullYear() === lastY;
      });
    },

    // 요약 데이터 계산용 헬퍼
    summaryStats: (state) => {
      const calculateTotal = (list, type) =>
        list
          .filter((t) => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);

      const tMonth = state.thisMonthTransactions;
      const lMonth = state.lastMonthTransactions;

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
    },
  },

  actions: {
    async fetchData() {
      this.loading = true;
      try {
        const transactions = await axiosClient.transactionApi.getTransactions();
        this.transactions = transactions;
      } catch (error) {
        console.error("Data Fetch Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteTransaction(id) {
      const index = this.transactions.findIndex((t) => t.id === id);
      if (index !== -1) {
        const backup = this.transactions[index];
        this.transactions.splice(index, 1);

        try {
          await axiosClient.transactionApi.deleteTransaction(id);
        } catch (error) {
          this.transactions.splice(index, 0, backup);
          alert("삭제에 실패했습니다.");
        }
      }
    },
    async addTransaction(payload) {
      try {
        // axiosClient에 정의된 createTransaction 호출
        const newTransaction =
          await axiosClient.transactionApi.createTransaction(payload);

        // 서버에서 생성된 객체를 반환받으면 로컬 배열에 추가
        if (newTransaction) {
          this.transactions.push(newTransaction);
        } else {
          // 만약 응답값이 없다면 전체를 다시 불러옴
          await this.fetchData();
        }
        return true; // 성공
      } catch (error) {
        console.error("거래 추가 실패:", error);
        alert("거래 내역을 추가하는데 실패했습니다.");
        return false; // 실패
      }
    },
  },
});
