import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useTransactionStore } from "../useTransactionStore";
import { useAuthStore } from "../auth/useAuthStore";

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
    // 1. Transaction 데이터 관리를 담당하는 스토어 호출
    const transactionStore = useTransactionStore();
    const authStore = useAuthStore();
    const userId = authStore.user.id;

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        user_id: userId,
        transacted_at: new Date(formData.transacted_at).toISOString(),
        created_at: new Date().toISOString(),
      };
      let url = "http://localhost:3000/transactions";
      let method = "POST";

      // 2. transactionStore의 addTransaction 액션 실행
      const isSuccess = await transactionStore.addTransaction(payload);

      // 3. 성공했을 경우에만 모달 닫기 (실패 처리는 transactionStore에서 alert 등으로 처리됨)
      if (isSuccess) {
        closeModal();
      }
    } catch (error) {
      console.error("서버 통신 에러:", error);
    }
    //   const response = await fetch('http://localhost:3000/transactions', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     closeModal();
    //   } else {
    //     console.error('거래 추가에 실패했습니다.');
    //   }
    // } catch (error) {
    //   console.error('서버 통신 에러:', error);
    // }
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
