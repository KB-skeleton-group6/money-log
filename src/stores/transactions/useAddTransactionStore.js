import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useAddTransactionStore = defineStore("addTransaction", () => {
  const isOpen = ref(false);

  const initialFormState = {
    type: "EXPENSE",
    transacted_at: new Date().toISOString().split('T')[0],
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
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        user_id: userId,
        transacted_at: new Date(formData.transacted_at).toISOString(), // DB 시간 형식으로 맞춤
        created_at: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        closeModal();
      } else {
        console.error("거래 추가에 실패했습니다.");
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
    submitTransaction
  };
});