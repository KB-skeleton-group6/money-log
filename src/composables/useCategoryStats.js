import { computed, toValue } from 'vue';
import { useTransactionStore } from '@/stores/transactions/useTransactionStore';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';
import { storeToRefs } from 'pinia';
import { calculatePercent } from '@/utils/formatter';

export function useCategoryStats(activeTypeRef) {
  const transactionStore = useTransactionStore();
  const categoryStore = useCategoryStore();
  const { thisMonthTransactions } = storeToRefs(transactionStore);

  const aggregatedStats = computed(() => {
    if (!thisMonthTransactions.value?.length || !categoryStore.categories.length) {
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
        const category = categoryStore.getCategoryById(Number(catId));

        return {
          name: category?.name ?? '기타',
          amount: stats.amount,
          count: stats.count,
          color: category?.color ?? '#ccc',
          icon: category?.icon ?? 'fa-solid fa-tag',
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
