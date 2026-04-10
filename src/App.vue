<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categories/useCategoryStore';

const categoryStore = useCategoryStore();
onMounted(() => {
  categoryStore.fetchCategories();
});
</script>
<template>
  <router-view></router-view>
</template>

<style scoped></style>
