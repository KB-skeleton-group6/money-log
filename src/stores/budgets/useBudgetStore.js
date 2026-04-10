import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export const useBudgetStore = defineStore("budget", () => {
  // { [category_id]: amount } 형태로 관리
  const budgets = ref({});

  function getBudgetAmount(categoryId) {
    return budgets.value[categoryId] ?? 0;
  }

  function clearBudgets() {
    budgets.value = {};
  }

  async function fetchBudgets() {
    try {
      const data = await axiosClient.budgetApi.getBudgets();
      budgets.value = Object.fromEntries(data.map((b) => [b.category_id, b.amount]));
    } catch (error) {
      console.error("예산 조회 실패:", error);
    }
  }

  async function saveBudgets(draftBudgets) {
    const items = Object.entries(draftBudgets).map(([category_id, amount]) => ({
      category_id: Number(category_id),
      amount,
    }));
    await axiosClient.budgetApi.saveBudgets(items);
    budgets.value = { ...draftBudgets };
  }

  const authStore = useAuthStore();
  watch(() => authStore.user, (newUser) => {
    if (newUser) {
      fetchBudgets();
    } else {
      clearBudgets();
    }
  });

  return { budgets, getBudgetAmount, fetchBudgets, saveBudgets, clearBudgets };
});
