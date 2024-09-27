<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import queryString from "query-string";
import TableComponent from "@/components/TableComponent.vue";
import IconComponent from "@/components/IconComponent.vue";
import InputComponent from "@/components/inputs/InputComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";

const route = useRoute();
const router = useRouter();

const page = ref(route.query.page);
const limit = ref(route.query.limit);
const total = 100;
const search = ref("");
const loading = ref(false);
const searching = ref(false);
const searchDebounceId = ref(null);

const rows = ref([]);

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "Name",
    field: "name",
  },
  {
    title: "Phone",
    field: "phone",
  },
  {
    title: "Email",
    field: "email",
  },
  {
    title: "Created date",
    field: "createdAt",
  },
];

const url = ref("https://66f0c4aff2a8bce81be69ab4.mockapi.io/api/v1");

const handleSearch = () => {
  searching.value = true;
  if (searchDebounceId.value) {
    clearTimeout(searchDebounceId.value);
  }
  searchDebounceId.value = setTimeout(() => {
    page.value = 1;
    updateUrl();
  }, 1000);
};

const handlePaginate = ($event) => {
  console.log($event, "paggg");
  page.value = $event;
  updateUrl();
};

const parseUrl = () => {
  page.value = route.query.page ? parseInt(route.query.page) : 1;
  limit.value = route.query.limit ? parseInt(route.query.limit) : 10;
  search.value = route.query.search ? route.query.search : "";
};

const updateUrl = () => {
  router.push({
    name: "users",
    query: {
      page: page.value,
      limit: limit.value,
      search: search.value,
    },
  });
};

const link = computed(() => {
  return `${url.value}/users?${queryString.stringify(
    {
      page: page.value,
      limit: limit.value,
      search: search.value,
    },
    { arrayFormat: "bracket" }
  )}`;
});

const get = async () => {
  loading.value = true;

  try {
    const response = await fetch(link.value, {
      method: "GET",
    });

    if (!response.ok) {
      throw response;
    }

    rows.value = await response.json();
  } catch (err) {
    const errors = await err.json();
    console.error(errors);
  } finally {
    loading.value = false;
    searching.value = false;
  }
};

const update = async () => {
  rows.value = [];
  loading.value = true;
  await get();
  loading.value = false;
};

watch(
  () => route.fullPath,
  () => {
    parseUrl();
    update();
  },
  { immediate: true }
);
</script>

<template>
  <main
    class="container mx-auto bg-white my-8 p-4 sm:p-8 shadow-custom rounded-4xl flex flex-col gap-4 sm:gap-8"
  >
    <div class="flex gap-4">
      <router-link :to="{ name: 'swagger' }" class="w-32 bg-primary text-white px-4 py-3 rounded-xl">
        Swagger API
      </router-link>
      <router-link :to="{ name: 'booking' }" class="w-24 bg-primary text-white px-4 py-3 rounded-xl">
        Booking
      </router-link>
    </div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0">All users</h2>
      <InputComponent
        placeholder="Search"
        v-model="search"
        @update:model-value="handleSearch"
        class="w-full sm:w-auto"
      >
        <template #before>
          <IconComponent category="outline" name="search" />
        </template>
      </InputComponent>
    </div>
    <div class="overflow-x-auto">
      <TableComponent :columns="columns" :rows="rows" :loading="loading" />
    </div>
    <PaginationComponent :total="total" :page="page" :limit="limit" @update:page="handlePaginate" />
  </main>
</template>

<style></style>
