import { computed, toValue } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { storeToRefs } from 'pinia';
import { Categories } from '@/constant/categories';

export function useCategoryStats(activeTypeRef) {
  const store = useTransactionStore();
  const { categories, thisMonthTransactions } = storeToRefs(store);

  const aggregatedStats = computed(() => {
    if (!thisMonthTransactions.value?.length || !categories.value?.length) {
      return [];
    }

    const typeKey = toValue(activeTypeRef).toUpperCase();
    const categoryMap = {};

    thisMonthTransactions.value.forEach((t) => {
      if (t.type === typeKey) {
        if (!categoryMap[t.category_id]) {
          categoryMap[t.category_id] = { amount: 0, count: 0 };
        }
        categoryMap[t.category_id].amount += t.amount;
        categoryMap[t.category_id].count += 1;
      }
    });

    const result = Object.keys(categoryMap).map((catId) => {
      const category = categories.value.find(
        (c) => String(c.id) === String(catId),
      );

      const staticCategory = Object.values(Categories).find(
        (c) => String(c.id) === String(catId),
      );

      return {
        name: category ? category.name : '기타',
        amount: categoryMap[catId].amount,
        count: categoryMap[catId].count,
        color: category?.color || '#ccc',
        icon: staticCategory?.icon || 'fa-solid fa-tag',
      };
    });

    return result.sort((a, b) => b.amount - a.amount);
  });

  return { aggregatedStats };
}
