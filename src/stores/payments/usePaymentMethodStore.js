import { defineStore } from "pinia";
import { ref } from "vue";
import { paymentMethodService } from "@/api/services/paymentMethodService";
import { DEFAULT_PAYMENT_METHOD_UI } from "@/constant/paymentMethods";

export const usePaymentMethodStore = defineStore("paymentMethod", () => {
  const paymentMethods = ref([]);

  async function fetchPaymentMethods() {
    try {
      paymentMethods.value = await paymentMethodService.fetchAll();
    } catch (error) {
      console.error("결제수단 조회 실패:", error);
    }
  }

  function getPaymentMethodByCode(code) {
    return (
      paymentMethods.value.find((method) => method.code === code) ?? {
        code,
        ...DEFAULT_PAYMENT_METHOD_UI,
      }
    );
  }

  return { paymentMethods, fetchPaymentMethods, getPaymentMethodByCode };
});
