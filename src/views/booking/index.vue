<template>
  <div class="relative grid grid-rows-[auto_1fr] grid-cols-[200px_1fr] container mx-auto my-6 gap-2">
    <!-- Секция с месяцем и кнопками -->
    <div class="row-span-1 col-span-2 flex justify-between items-center mb-4">
      <button @click="prevMonth" class="px-4 py-2 bg-gray-200 rounded">Предыдущий</button>
      <h2 class="text-xl">{{ currentMonthYear }}</h2>
      <button @click="nextMonth" class="px-4 py-2 bg-gray-200 rounded">Следующий</button>
    </div>

    <!-- Секция с датами -->
    <div class="row-span-1 col-start-2 grid grid-cols-[repeat(31,1fr)] text-center bg-gray-200">
      <div v-for="day in daysInMonth" :key="day" class="py-2">
        {{ day.getDate() }}
      </div>
    </div>

    <!-- Секция с объектами -->
    <div class="row-span-2 col-start-1">
      <div
        v-for="object in objects"
        :key="object.id"
        class="h-[50px] flex items-center p-2 bg-gray-100 border"
        @mouseenter="showTooltip(object.name, $event)"
        @mouseleave="hideTooltip"
      >
        <span class="truncate">
          {{ object.name }}
        </span>
      </div>
    </div>

    <!-- Бронирования -->
    <div class="row-span-2 col-start-2">
      <div v-for="object in objects" :key="object.id" class="relative border-t h-[50px]">
        <div
          v-for="booking in getBookingsForObject(object.id)"
          :key="booking.id"
          :style="bookingStyle(booking)"
          class="absolute bg-green-200 p-2 rounded overflow-hidden text-ellipsis"
          @mouseenter="showTooltip(booking.guest, $event)"
          @mouseleave="hideTooltip"
        >
          <span class="truncate">
            {{ booking.guest }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltipVisible"
      class="absolute bg-gray-800 text-white p-2 rounded text-sm z-10"
      :style="tooltipStyle"
    >
      {{ tooltipContent }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const objects = ref([
      { id: 1, name: "Saint Basil's Cathedral" },
      { id: 2, name: "Cathedral of Christ the Saviour" },
      { id: 3, name: "Bolshoi Theatre" },
      { id: 4, name: "Tretyakov Drive" },
      { id: 5, name: "Red Square" },
      { id: 6, name: "Tsvetnoy Boulevard" },
      { id: 7, name: "Old Arbat Street" },
      { id: 8, name: "Pushkinskaya Square" },
      { id: 9, name: "Kuznetsky Most" },
      { id: 10, name: "Manezhnaya Square" },
    ]);

    const bookings = ref([
      { id: 1, guest: "John Doe", startDate: "2024-01-05", endDate: "2024-01-05", objectId: 1 },
      { id: 2, guest: "Alice Johnson", startDate: "2024-01-06", endDate: "2024-01-10", objectId: 2 },
      { id: 3, guest: "Bob Smith", startDate: "2024-01-11", endDate: "2024-01-15", objectId: 3 },
      { id: 4, guest: "Carol White", startDate: "2024-01-16", endDate: "2024-01-20", objectId: 4 },
      { id: 5, guest: "David Brown", startDate: "2024-01-21", endDate: "2024-01-25", objectId: 5 },
      { id: 6, guest: "Eve Green", startDate: "2024-01-26", endDate: "2024-01-30", objectId: 10 },
      { id: 7, guest: "Frank Black", startDate: "2024-02-01", endDate: "2024-02-05", objectId: 7 },
      { id: 8, guest: "Grace Hall", startDate: "2024-02-06", endDate: "2024-02-10", objectId: 8 },
      { id: 9, guest: "Henry Ford", startDate: "2024-02-11", endDate: "2024-02-15", objectId: 9 },
      { id: 10, guest: "Isabel Clark", startDate: "2024-02-16", endDate: "2024-02-20", objectId: 10 },
    ]);

    const currentMonth = ref(new Date().getMonth());
    const currentYear = ref(new Date().getFullYear());

    const daysInMonth = computed(() => {
      const year = currentYear.value;
      const month = currentMonth.value;
      const date = new Date(year, month, 1);
      const result = [];
      while (date.getMonth() === month) {
        result.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return result;
    });

    const currentMonthYear = computed(() => {
      const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      return `${monthNames[currentMonth.value]} ${currentYear.value}`;
    });

    const bookingStyle = (booking) => {
      const start = new Date(booking.startDate).getDate() - 1;
      const end = new Date(booking.endDate).getDate() - 1;
      return {
        left: `${(start / 31) * 100}%`,
        width: `${((end - start + 1) / 31) * 100}%`,
      };
    };

    const getBookingsForObject = (objectId) =>
      bookings.value.filter((booking) => booking.objectId === objectId);

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
      } else {
        currentMonth.value += 1;
      }
    };

    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
      } else {
        currentMonth.value -= 1;
      }
    };

    const tooltipVisible = ref(false);
    const tooltipContent = ref("");
    const tooltipStyle = ref({ top: "0px", left: "0px" });

    const showTooltip = (content, event) => {
      tooltipContent.value = content;
      tooltipVisible.value = true;
      const boundingRect = event.target.getBoundingClientRect();
      tooltipStyle.value = {
        top: `${boundingRect.top + window.scrollY + 20}px`,
        left: `${boundingRect.left + window.scrollX}px`,
      };
    };

    const hideTooltip = () => {
      tooltipVisible.value = false;
    };

    return {
      objects,
      bookings,
      daysInMonth,
      currentMonthYear,
      nextMonth,
      prevMonth,
      bookingStyle,
      getBookingsForObject,
      tooltipVisible,
      tooltipContent,
      tooltipStyle,
      showTooltip,
      hideTooltip,
    };
  },
};
</script>
