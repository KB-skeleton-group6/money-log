import axiosClient from '@/api/axiosClient';
import { enrichCategory } from '@/constant/categories';

export const categoryService = {
  async fetchAll() {
    const categories = await axiosClient.categoryApi.getCategories();
    return categories.map(enrichCategory);
  },
};
