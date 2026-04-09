import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useAddTransactionStore = defineStore('addTransaction', () => {
  const isOpen = ref(false);

  // 수정 모드 구분 변수 추가
  const isEditMode = ref(false);
  const editTargetId = ref(null);

  const initialFormState = {
    type: 'EXPENSE',
    transacted_at: new Date().toISOString().split('T')[0],
    amount: '',
    category_id: '',
    detail: '',
    memo: '',
    method: 'CARD',
  };

  const formData = reactive({ ...initialFormState });

  const openModal = () => {
    resetForm(); //열 때 항상 초기화
    isOpen.value = true;
  };

  const openEditModal = (transactionData) => {
    const formattedDate = new Date(transactionData.transacted_at)
      .toISOString()
      .split('T')[0];
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
  const submitTransaction = async (userId = 'user01') => {
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        user_id: userId,
        transacted_at: new Date(formData.transacted_at).toISOString(), // DB 시간 형식으로 맞춤
        // created_at: new Date().toISOString(),
      };
      let url = 'http://localhost:3000/transactions';
      let method = 'POST';

      if (isEditMode.value) {
        url = `http://localhost:3000/transactions/${editTargetId.value}`;
        method = 'PUT'; // 수정은 PUT
      } else {
        payload.created_at = new Date().toISOString(); // 생성일은 '추가'할 때만 넣기
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        closeModal();
      } else {
        console.error(
          isEditMode.value
            ? '거래 수정에 실패했습니다.'
            : '거래 추가에 실패했습니다.',
        );
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
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
