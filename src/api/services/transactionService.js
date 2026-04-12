import axiosClient from '@/api/axiosClient';
import { authContext } from '@/api/authContext';

export const transactionService = {
  async fetchAll() {
    if (!authContext.isLoggedIn()) return [];
    return axiosClient.transactionApi.getTransactionsByUserId(authContext.getUserId());
  },

  async create(payload) {
    return axiosClient.transactionApi.createTransaction({
      ...payload,
      user_id: authContext.getUserId(),
    });
  },

  async update(id, payload) {
    return axiosClient.transactionApi.updateTransaction(id, payload);
  },

  async remove(id) {
    return axiosClient.transactionApi.deleteTransaction(id);
  },
};
