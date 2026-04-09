import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useTransactionStore } from "../useTransactionStore";

export const useAddTransactionStore = defineStore("addTransaction", () => {
  const isOpen = ref(false);

  const initialFormState = {
    type: "EXPENSE",
    transacted_at: new Date().toISOString().split("T")[0],
    amount: "",
    category_id: "",
    detail: "",
    memo: "",
    method: "CARD",
  };

  const formData = reactive({ ...initialFormState });

  const openModal = () => {
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    resetForm();
  };

  const resetForm = () => {
    Object.assign(formData, initialFormState);
  };

  // json-server로 데이터 POST 요청
  const submitTransaction = async (userId = "user01") => {
    // 1. Transaction 데이터 관리를 담당하는 스토어 호출
    const transactionStore = useTransactionStore();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        user_id: userId,
        transacted_at: new Date(formData.transacted_at).toISOString(),
        created_at: new Date().toISOString(),
      };

      // 2. transactionStore의 addTransaction 액션 실행
      const isSuccess = await transactionStore.addTransaction(payload);

      // 3. 성공했을 경우에만 모달 닫기 (실패 처리는 transactionStore에서 alert 등으로 처리됨)
      if (isSuccess) {
        closeModal();
      }
    } catch (error) {
      console.error("서버 통신 에러:", error);
    }
  };

  return {
    isOpen,
    formData,
    openModal,
    closeModal,
    resetForm,
    submitTransaction,
  };
});
