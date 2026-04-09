import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axiosClient';

// 'transaction'이라는 고유 ID를 가진 Store 만들기
export const useTransactionStore = defineStore('transaction', () => {
  // 1. State (데이터 상태 = 기존의 ref)
  const transactions = ref([]);
  const categories = ref([]);

  // 2. Actions (데이터를 조작하는 함수들)
  const fetchData = async () => {
    try {
      const [txData, catData] = await Promise.all([
        api.transactionApi.getTransactions(),
        api.categoryApi.getCategories(),
      ]);
      transactions.value = txData;
      categories.value = catData;
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const addTransaction = async (formData) => {
    try {
      // api.transactionApi.createTransaction 사용
      await api.transactionApi.createTransaction(formData);
      await fetchData();
    } catch (error) {
      console.error('거래 추가 실패:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.transactionApi.deleteTransaction(id);
      // 서버 삭제 성공 후 로컬 상태에서 제거
      transactions.value = transactions.value.filter(
        (tx) => String(tx.id) !== String(id),
      );
    } catch (error) {
      console.error('거래 삭제 실패: ', error);
    }
  };

  // 3. Getters (계산된 데이터 = 기존의 computed)
  // 예: 수입 총액만 따로 빼서 보고 싶을 때
  const totalIncome = computed(() => {
    return transactions.value
      .filter((tx) => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  // 밖으로 꺼내줄(공유할) 것들을 return
  return {
    transactions,
    categories,
    fetchData,
    addTransaction,
    deleteTransaction,
    totalIncome,
  };
});
