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

<script setup>
import { ref, computed } from "vue";

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
  // Январь
  { id: 1, guest: "John Doe", startDate: "2024-01-05", endDate: "2024-01-05", objectId: 1 },
  { id: 2, guest: "Alice Johnson", startDate: "2024-01-06", endDate: "2024-01-10", objectId: 2 },
  { id: 3, guest: "Bob Smith", startDate: "2024-01-11", endDate: "2024-01-15", objectId: 3 },
  { id: 4, guest: "Carol White", startDate: "2024-01-16", endDate: "2024-01-20", objectId: 4 },
  { id: 5, guest: "David Brown", startDate: "2024-01-21", endDate: "2024-01-25", objectId: 5 },
  { id: 6, guest: "Eve Green", startDate: "2024-01-26", endDate: "2024-01-30", objectId: 10 },

  // Февраль
  { id: 7, guest: "Frank Black", startDate: "2024-02-01", endDate: "2024-02-05", objectId: 7 },
  { id: 8, guest: "Grace Hall", startDate: "2024-02-06", endDate: "2024-02-10", objectId: 8 },
  { id: 9, guest: "Henry Ford", startDate: "2024-02-11", endDate: "2024-02-15", objectId: 9 },
  { id: 10, guest: "Isabel Clark", startDate: "2024-02-16", endDate: "2024-02-20", objectId: 10 },

  // Март
  { id: 11, guest: "Julia Adams", startDate: "2024-03-01", endDate: "2024-03-05", objectId: 1 },
  { id: 12, guest: "Steve Rogers", startDate: "2024-03-06", endDate: "2024-03-10", objectId: 3 },
  { id: 13, guest: "Tony Stark", startDate: "2024-03-11", endDate: "2024-03-15", objectId: 6 },
  { id: 14, guest: "Natasha Romanoff", startDate: "2024-03-16", endDate: "2024-03-20", objectId: 7 },

  // Апрель
  { id: 15, guest: "Bruce Wayne", startDate: "2024-04-01", endDate: "2024-04-05", objectId: 5 },
  { id: 16, guest: "Clark Kent", startDate: "2024-04-06", endDate: "2024-04-10", objectId: 4 },

  // Май
  { id: 17, guest: "Peter Parker", startDate: "2024-05-01", endDate: "2024-05-05", objectId: 9 },
  { id: 18, guest: "Bruce Banner", startDate: "2024-05-06", endDate: "2024-05-10", objectId: 8 },

  // Июнь
  { id: 19, guest: "Diana Prince", startDate: "2024-06-01", endDate: "2024-06-05", objectId: 2 },
  { id: 20, guest: "Barry Allen", startDate: "2024-06-06", endDate: "2024-06-10", objectId: 1 },

  // Июль
  { id: 21, guest: "Arthur Curry", startDate: "2024-07-01", endDate: "2024-07-05", objectId: 7 },
  { id: 22, guest: "Hal Jordan", startDate: "2024-07-06", endDate: "2024-07-10", objectId: 5 },

  // Август
  { id: 23, guest: "Wade Wilson", startDate: "2024-08-01", endDate: "2024-08-05", objectId: 10 },
  { id: 24, guest: "Victor Stone", startDate: "2024-08-06", endDate: "2024-08-10", objectId: 6 },

  // Сентябрь
  { id: 25, guest: "Scott Lang", startDate: "2024-09-01", endDate: "2024-09-05", objectId: 3 },
  { id: 26, guest: "Hope van Dyne", startDate: "2024-09-06", endDate: "2024-09-10", objectId: 9 },

  // Октябрь
  { id: 27, guest: "Stephen Strange", startDate: "2024-10-01", endDate: "2024-10-05", objectId: 4 },
  { id: 28, guest: "Wanda Maximoff", startDate: "2024-10-06", endDate: "2024-10-10", objectId: 5 },
  { id: 33, guest: "Abdula Alkhilaev", startDate: "2024-10-06", endDate: "2024-10-10", objectId: 4 },
  { id: 34, guest: "Magdi Murtuzov", startDate: "2024-10-30", endDate: "2024-11-2", objectId: 4 },
  { id: 1, guest: "John Doe", startDate: "2024-10-29", endDate: "2024-11-5", objectId: 1 },

  // Ноябрь
  { id: 29, guest: "T'Challa", startDate: "2024-11-01", endDate: "2024-11-05", objectId: 8 },
  { id: 30, guest: "Shuri", startDate: "2024-11-06", endDate: "2024-11-10", objectId: 7 },

  // Декабрь
  { id: 31, guest: "Loki Laufeyson", startDate: "2024-12-01", endDate: "2024-12-05", objectId: 9 },
  { id: 32, guest: "Thor Odinson", startDate: "2024-12-06", endDate: "2024-12-10", objectId: 10 },
]);

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Дни в месяце
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

// Фильтр бронирований по месяцу
const filteredBookings = computed(() => {
  return bookings.value.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    // Проверка, пересекает ли бронирование текущий месяц
    return (
      (startDate.getMonth() === currentMonth.value && startDate.getFullYear() === currentYear.value) ||
      (endDate.getMonth() === currentMonth.value && endDate.getFullYear() === currentYear.value) ||
      (startDate < new Date(currentYear.value, currentMonth.value, 1) &&
        endDate > new Date(currentYear.value, currentMonth.value + 1, 0))
    );
  });
});

const bookingStyle = (booking) => {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);

  const start = startDate < firstDayOfMonth ? 0 : startDate.getDate() - 1;
  const end = endDate > lastDayOfMonth ? lastDayOfMonth.getDate() - 1 : endDate.getDate() - 1;

  return {
    left: `${(start / lastDayOfMonth.getDate()) * 100}%`,
    width: `calc(${((end - start + 1) / lastDayOfMonth.getDate()) * 100}% - 5px)`, // уменьшаем ширину на 5px
  };
};

const getBookingsForObject = (objectId) =>
  filteredBookings.value.filter((booking) => booking.objectId === objectId);

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
</script>
