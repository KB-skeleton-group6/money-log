import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useAddTransactionStore = defineStore("addTransaction", () => {
  const isOpen = ref(false);

  const initialFormState = {
    isIncome: true,
    date: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    amount: "",
    category: "",
    detail: "",
    memo: "",
    paymentMethod: "신용카드",
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

  return { 
    isOpen, 
    formData, 
    openModal, 
    closeModal, 
    resetForm 
  };
});