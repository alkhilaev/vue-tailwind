<template>
  <div class="relative min-h-[582px]">
    <table class="min-w-full border-collapse bg-white text-left text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th v-for="(col, i) in columns" :key="i" class="p-4 text-gray-600 font-semibold">
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr>
            <td :colspan="columns.length" class="p-4 text-center">
              <LoadingIndicator />
            </td>
          </tr>
        </template>
        <template v-else-if="rows.length === 0">
          <tr>
            <td :colspan="columns.length" class="p-4 text-gray-500">No data</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(row, i) in rows" :key="i" class="border-t">
            <td v-for="(col, i) in columns" :key="i" class="p-4 text-gray-800">
              {{ row[col.field] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import LoadingIndicator from "@/components/LoadingIndicator.vue";

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
