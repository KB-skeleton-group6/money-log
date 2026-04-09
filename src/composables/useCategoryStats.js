import { computed, toValue } from 'vue';
import { useTransactionStore } from '@/stores/useTransactionStore';
import { storeToRefs } from 'pinia';

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
      return {
        name: category ? category.name : '기타',
        amount: categoryMap[catId].amount,
        count: categoryMap[catId].count,
        color: category ? category.color : '#ccc',
        icon: category?.label === 'INCOME' ? '💰' : '💸',
      };
    });

    return result.sort((a, b) => b.amount - a.amount);
  });

  return { aggregatedStats };
}
