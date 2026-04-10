import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "@/api/axiosClient";
import { enrichCategory } from "@/constant/categories";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);

  async function fetchCategories() {
    try {
      const data = await axiosClient.categoryApi.getCategories();
      categories.value = data.map(enrichCategory);
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  }

  function getCategoryById(id) {
    return categories.value.find((c) => c.id === id);
  }

  return { categories, fetchCategories, getCategoryById };
});
