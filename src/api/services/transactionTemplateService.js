import axiosClient from '@/api/axiosClient';
import { authContext } from '@/api/authContext';

export const transactionTemplateService = {
  async fetchAll() {
    if (!authContext.isLoggedIn()) return [];
    return axiosClient.transactionTemplateApi.getTransactionTemplatesByUserId(authContext.getUserId());
  },

  async create(payload) {
    return axiosClient.transactionTemplateApi.createTransactionTemplate({
      ...payload,
      user_id: authContext.getUserId(),
      created_at: new Date().toISOString(),
    });
  },

  async remove(id) {
    return axiosClient.transactionTemplateApi.deleteTransactionTemplate(id);
  },
};
