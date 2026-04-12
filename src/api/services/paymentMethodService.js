import axiosClient from "@/api/axiosClient";
import { enrichPaymentMethod } from "@/constant/paymentMethods";

export const paymentMethodService = {
  async fetchAll() {
    const paymentMethods = await axiosClient.paymentApi.getPayments();
    return paymentMethods.map(enrichPaymentMethod);
  },
};
