<template>
  <div class="flex items-center justify-end space-x-2 sm:space-x-3">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
    >
      <IconComponent name="arrow-left-s-line" />
    </button>
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="[
        'w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded',
        currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      ]"
    >
      {{ page }}
    </button>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
    >
      <IconComponent name="arrow-right-s-line" />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import IconComponent from "@/components/IconComponent.vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:page"]);

// Вычисляем общее количество страниц
const totalPages = computed(() => Math.ceil(props.total / props.limit));

// Генерация номеров страниц
const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});

// Текущая страница
const currentPage = computed({
  get: () => props.page,
  set: (value) => emit("update:page", value),
});

// Метод для смены страницы
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>
