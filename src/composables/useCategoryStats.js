import { computed, toValue } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { storeToRefs } from 'pinia';
import { getCategoryById } from '@/constant/categories';
import { calculatePercent } from '@/utils/formatter';

export function useCategoryStats(activeTypeRef) {
  const store = useTransactionStore();
  const { categories, thisMonthTransactions } = storeToRefs(store);

  const aggregatedStats = computed(() => {
    if (!thisMonthTransactions.value?.length || !categories.value?.length) {
      return [];
    }

    const typeKey = toValue(activeTypeRef).toUpperCase();

    const categoryMap = thisMonthTransactions.value
      .filter((t) => t.type === typeKey)
      .reduce((acc, t) => {
        if (!acc[t.category_id]) {
          acc[t.category_id] = { amount: 0, count: 0 };
        }
        acc[t.category_id].amount += t.amount;
        acc[t.category_id].count += 1;
        return acc;
      }, {});

    return Object.entries(categoryMap)
      .map(([catId, stats]) => {
        const category = categories.value.find(
          (c) => String(c.id) === String(catId),
        );

        const staticCategory = getCategoryById(catId);

        return {
          name: category ? category.name : '기타',
          amount: stats.amount,
          count: stats.count,
          color: category?.color || '#ccc',
          icon: staticCategory?.icon || 'fa-solid fa-tag',
        };
      })
      .sort((a, b) => b.amount - a.amount);
  });

  const processedData = computed(() => {
    const stats = aggregatedStats.value;
    if (stats.length === 0) {
      return { labels: [], values: [], colors: [], count: 0 };
    }

    const totalSum = stats.reduce((sum, item) => sum + item.amount, 0);

    return {
      labels: stats.map((r) => r.name),
      values: stats.map((r) => calculatePercent(r.amount, totalSum)),
      colors: stats.map((r) => r.color),
      count: stats.length,
    };
  });

  return { aggregatedStats, processedData };
}
