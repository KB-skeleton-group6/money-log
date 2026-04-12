import { defineStore } from 'pinia';
import { ref } from 'vue';
import { transactionTemplateService } from '@/api/services/transactionTemplateService';
import { useTransactionStore } from './useTransactionStore';

export const useTransactionTemplateStore = defineStore('transactionTemplate', () => {
  const templates = ref([]);
  const loading = ref(false);

  async function fetchTemplates() {
    loading.value = true;
    try {
      templates.value = await transactionTemplateService.fetchAll();
    } catch (error) {
      console.error('템플릿 불러오기 실패:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addTemplate(formData) {
    try {
      const payload = {
        type: formData.type,
        amount: Number(formData.amount),
        category_id: formData.category_id,
        detail: formData.detail,
        memo: formData.memo ?? '',
        payment: formData.payment ?? null,
      };
      const newTemplate = await transactionTemplateService.create(payload);
      if (newTemplate) {
        templates.value = [...templates.value, newTemplate];
      }
      return true;
    } catch (error) {
      console.error('템플릿 저장 실패:', error);
      alert('즐겨찾기 저장에 실패했습니다.');
      return false;
    }
  }

  async function removeTemplate(id) {
    const index = templates.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      const backup = templates.value[index];
      templates.value.splice(index, 1);
      try {
        await transactionTemplateService.remove(id);
      } catch (error) {
        templates.value.splice(index, 0, backup);
        alert('즐겨찾기 삭제에 실패했습니다.');
      }
    }
  }

  async function applyTemplate(template) {
    const transactionStore = useTransactionStore();
    const payload = {
      type: template.type,
      amount: template.amount,
      category_id: template.category_id,
      detail: template.detail,
      memo: template.memo ?? '',
      payment: template.payment ?? null,
      transacted_at: new Date().toISOString(),
    };
    return transactionStore.addTransaction(payload);
  }

  return {
    templates,
    loading,
    fetchTemplates,
    addTemplate,
    removeTemplate,
    applyTemplate,
  };
});
