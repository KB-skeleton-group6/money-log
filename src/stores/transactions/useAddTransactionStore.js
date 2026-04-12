import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import { useTransactionStore } from "./useTransactionStore";

export const useAddTransactionStore = defineStore("addTransaction", () => {
  const isOpen = ref(false);

  // 수정 모드 구분 변수 추가
  const isEditMode = ref(false);
  const editTargetId = ref(null);

  const initialFormState = {
    type: "EXPENSE",
    transacted_at: dayjs().format("YYYY-MM-DD"),
    transacted_time: dayjs().format("HH:mm"),
    amount: "",
    category_id: "",
    detail: "",
    memo: "",
    payment: "CREDIT_CARD",
  };

  const formData = reactive({ ...initialFormState });

  const openModal = () => {
    resetForm(); //열 때 항상 초기화
    isOpen.value = true;
  };

  const openEditModal = (transactionData) => {
    const dt = dayjs(transactionData.transacted_at);
    Object.assign(formData, {
      ...transactionData,
      transacted_at: dt.format("YYYY-MM-DD"),
      transacted_time: dt.format("HH:mm"),
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
    Object.assign(formData, {
      ...initialFormState,
      transacted_at: dayjs().format("YYYY-MM-DD"),
      transacted_time: dayjs().format("HH:mm"),
    });
    // 모달이 닫히면 수정 모드 상태도 초기화
    isEditMode.value = false;
    editTargetId.value = null;
  };

  // json-server로 데이터 POST 요청
  const submitTransaction = async () => {
    const transactionStore = useTransactionStore();

    try {
      // transacted_time은 payload에 포함하지 않음
      const { transacted_time, ...formRest } = formData;
      const payload = {
        ...formRest,
        amount: Number(formData.amount),
        transacted_at: dayjs(`${formData.transacted_at} ${transacted_time}`).toISOString(),
        created_at: new Date().toISOString(),
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
      return isSuccess;
    } catch (error) {
      console.error("서버 통신 에러:", error);
      return false;
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
