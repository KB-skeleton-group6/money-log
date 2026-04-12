import { defineStore } from "pinia";
import { ref } from "vue";
import { categoryService } from "@/api/services/categoryService";
import { DEFAULT_CATEGORY_UI } from "@/constant/categories";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);

  async function fetchCategories() {
    try {
      categories.value = await categoryService.fetchAll();
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  }

  const DEFAULT_CATEGORY = { name: "미분류", ...DEFAULT_CATEGORY_UI };

  function getCategoryById(id) {
    return categories.value.find((c) => String(c.id) === String(id)) ?? DEFAULT_CATEGORY;
  }

  return { categories, fetchCategories, getCategoryById };
});
