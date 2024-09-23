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
      @click="changePage(1)"
      :class="[
        'w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded',
        currentPage === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      ]"
    >
      1
    </button>
    <span v-if="showLeftEllipsis" class="text-gray-600">...</span>
    <button
      v-for="page in filteredPagesToShow"
      :key="page"
      @click="changePage(page)"
      :class="[
        'w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded',
        currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      ]"
    >
      {{ page }}
    </button>
    <span v-if="showRightEllipsis" class="text-gray-600">...</span>
    <button
      v-if="totalPages > 1"
      @click="changePage(totalPages)"
      :class="[
        'w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded',
        currentPage === totalPages ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      ]"
    >
      {{ totalPages }}
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
const pagesToShow = computed(() => {
  const pages = [];
  if (totalPages.value <= 6) {
    for (let i = 2; i <= totalPages.value - 1; i++) {
      // Начинаем со 2 страницы, заканчиваем перед последней
      pages.push(i);
    }
  } else {
    const startPage = Math.max(2, props.page - 1);
    const endPage = Math.min(totalPages.value - 1, props.page + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }
  return pages;
});

// Отфильтрованные страницы без первой и последней
const filteredPagesToShow = computed(() => {
  return pagesToShow.value.filter((page) => page !== 1 && page !== totalPages.value);
});

// Показываем многоточие слева
const showLeftEllipsis = computed(() => props.page > 3);

// Показываем многоточие справа
const showRightEllipsis = computed(() => props.page < totalPages.value - 3);

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
