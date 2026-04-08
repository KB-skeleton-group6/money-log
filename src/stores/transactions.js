import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 'transaction'이라는 고유 ID를 가진 Store를 만듭니다.
export const useTransactionStore = defineStore('transaction', () => {
  // 1. State (데이터 상태 = 기존의 ref)
  const transactions = ref([]);
  const categories = ref([]);

  // 2. Actions (데이터를 조작하는 함수들)
  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        fetch('http://localhost:3000/transactions'),
        fetch('http://localhost:3000/categories'),
      ]);
      transactions.value = await txRes.json();
      categories.value = await catRes.json();
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const addTransaction = async (formData) => {
    await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    fetchData(); // 추가 후 데이터 새로고침
  };

  const deleteTransaction = async (id) => {
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE',
    });
    // 서버 삭제 후, 로컬 데이터에서도 즉시 제거
    transactions.value = transactions.value.filter((tx) => tx.id !== id);
  };

  // 3. Getters (계산된 데이터 = 기존의 computed)
  // 예: 수입 총액만 따로 빼서 보고 싶을 때
  const totalIncome = computed(() => {
    return transactions.value
      .filter((tx) => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  // ✨ 이 은행에서 밖으로 꺼내줄(공유할) 것들을 return 해줍니다.
  return {
    transactions,
    categories,
    fetchData,
    addTransaction,
    deleteTransaction,
    totalIncome,
  };
});
