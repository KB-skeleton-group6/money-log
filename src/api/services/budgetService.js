import axiosClient from "@/api/axiosClient";
import { authContext } from "@/api/authContext";

export const budgetService = {
  async fetchAll() {
    if (!authContext.isLoggedIn()) return [];

    const budgets = await axiosClient.budgetApi.getBudgets(
      authContext.getUserId(),
    );
    return budgets;
  },

  async save(draftBudgets) {
    const userId = authContext.getUserId();

    const existingBudgets = await axiosClient.budgetApi.getBudgets(userId);
    const existingMap = Object.fromEntries(
      existingBudgets.map((b) => [String(b.category_id), b.id]),
    );

    await Promise.all(
      Object.entries(draftBudgets).map(([category_id, amount]) => {
        const existingId = existingMap[category_id];
        if (existingId) {
          return axiosClient.budgetApi.updateBudget(existingId, {
            user_id: userId,
            category_id,
            amount,
          });
        } else {
          return axiosClient.budgetApi.createBudget({
            user_id: userId,
            category_id,
            amount,
          });
        }
      }),
    );
  },
};
