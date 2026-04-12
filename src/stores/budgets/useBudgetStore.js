import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { budgetService } from "@/api/services/budgetService";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export const useBudgetStore = defineStore("budget", () => {
  const budgets = ref({}); // { [category_id]: amount }

  function getBudgetAmount(categoryId) {
    return budgets.value[String(categoryId)] ?? 0;
  }

  function clearBudgets() {
    budgets.value = {};
  }

  async function fetchBudgets() {
    try {
      const data = await budgetService.fetchAll();
      // category_id별로 가장 마지막 레코드 기준으로 적용 (중복 방지)
      console.log(data);
      budgets.value = data.reduce((acc, b) => {
        acc[String(b.category_id)] = b.amount;
        return acc;
      }, {});
    } catch (error) {
      console.error("예산 조회 실패:", error);
    }
  }

  async function saveBudgets(draftBudgets) {
    await budgetService.save(draftBudgets);
    budgets.value = { ...draftBudgets };
  }

  const authStore = useAuthStore();
  watch(
    () => authStore.user,
    (newUser) => {
      if (newUser) {
        fetchBudgets();
      } else {
        clearBudgets();
      }
    },
    { immediate: true },
  );

  return { budgets, getBudgetAmount, fetchBudgets, saveBudgets, clearBudgets };
});
