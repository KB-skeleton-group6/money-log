import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useTransactionStore } from "./useTransactionStore";

export const useAddTransactionStore = defineStore("addTransaction", () => {
  const isOpen = ref(false);

  // 수정 모드 구분 변수 추가
  const isEditMode = ref(false);
  const editTargetId = ref(null);

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
    resetForm(); //열 때 항상 초기화
    isOpen.value = true;
  };

  const openEditModal = (transactionData) => {
    const formattedDate = new Date(transactionData.transacted_at)
      .toISOString()
      .split("T")[0];
    // 기존 데이터를 폼에 덮어씌움
    Object.assign(formData, {
      ...transactionData,
      transacted_at: formattedDate,
    });

    isEditMode.value = true;
    editTargetId.value = transactionData.id;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    resetForm();
  };

  const resetForm = () => {
    Object.assign(formData, initialFormState);
    // 모달이 닫히면 수정 모드 상태도 초기화
    isEditMode.value = false;
    editTargetId.value = null;
  };

  // json-server로 데이터 POST 요청
  const submitTransaction = async () => {
    const transactionStore = useTransactionStore();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        transacted_at: new Date(formData.transacted_at).toISOString(),
        created_at: new Date(),
      };

      let isSuccess = false;

      if (isEditMode.value) {
        // ✅ 수정 모드일 때: 수정 액션 호출 (ID와 데이터를 함께 보냄)
        isSuccess = await transactionStore.updateTransaction(
          editTargetId.value,
          payload,
        );
      } else {
        // ✅ 추가 모드일 때: 기존처럼 추가 액션 호출
        isSuccess = await transactionStore.addTransaction(payload);
      }

      if (isSuccess) {
        closeModal();
      }
    } catch (error) {
      console.error("서버 통신 에러:", error);
    }
  };

  return {
    isOpen,
    isEditMode, // 내보내기 추가
    formData,
    openModal,
    openEditModal, // 내보내기 추가
    closeModal,
    resetForm,
    submitTransaction,
  };
});
