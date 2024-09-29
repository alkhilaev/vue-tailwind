<template>
  <div class="container mx-auto my-6">
    <div class="flex">
      <!-- Колонка объектов -->
      <div class="w-48" style="padding-top: 20px">
        <!-- Пустая ячейка для заголовка дат -->
        <div class="h-12 border-b border-r"></div>
        <!-- Список объектов -->
        <div>
          <div v-for="object in objects" :key="object.id" class="h-12 flex items-center border-b border-r">
            <span class="truncate">
              {{ object.name }}
            </span>
          </div>
        </div>
      </div>
      <!-- Скролл дат и бронирований -->
      <div class="flex-1 overflow-x-auto relative" @scroll="handleScroll" ref="scrollContainer">
        <div class="relative" :style="{ width: totalWidth + 'px' }" style="padding-top: 20px">
          <!-- Заголовок дат -->
          <div class="flex relative">
            <div
              v-for="(date, index) in displayedDates"
              :key="index"
              class="h-12 border-b border-r flex items-center justify-center relative"
              :style="{ width: CELL_WIDTH + 'px' }"
            >
              <div>
                {{ dateLabel(date) }}
              </div>
              <!-- Вертикальная линия для текущей даты -->
              <div
                v-if="isToday(date)"
                class="absolute bg-black"
                :style="{
                  width: '2px',
                  height: 'calc(100% + ' + objects.length * 48 + 'px)',
                  right: '0',
                  top: '0',
                }"
              ></div>
            </div>
          </div>
          <!-- Сетка бронирований -->
          <div>
            <div v-for="object in objects" :key="object.id" class="relative h-12 border-b border-r">
              <!-- Блоки бронирований -->
              <div
                v-for="booking in getBookingsForObject(object.id)"
                :key="booking.id"
                :style="bookingStyle(booking)"
                class="absolute top-0 h-full bg-green-200 border border-green-400 overflow-hidden text-ellipsis whitespace-nowrap px-1 rounded-md"
                @mouseenter="showTooltip(booking.guest, $event)"
                @mouseleave="hideTooltip"
              >
                {{ booking.guest }}
              </div>
            </div>
          </div>
          <!-- Метки месяцев -->
          <div class="relative" style="top: -255px">
            <div
              v-for="(month, index) in monthMarkers"
              :key="index"
              class="month-marker"
              :class="{ 'month-marker--before': month.align === 'right' }"
              :style="{
                left: month.position + 'px',
                top: '-3.5rem',
                transform: month.align === 'left' ? 'translateX(-105%)' : 'translateX(0)',
              }"
            >
              {{ month.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Подсказка -->
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
import { computed, nextTick, onMounted, ref } from "vue";

const CELL_WIDTH = 30; // Ширина каждой ячейки даты в пикселях

const objects = ref([
  { id: 1, name: "Объект 1" },
  { id: 2, name: "Объект 2" },
  { id: 3, name: "Объект 3" },
  { id: 4, name: "Объект 4" },
  { id: 5, name: "Объект 5" },
]);

const bookings = ref([]);

// Генерация данных бронирований
const generateBookings = () => {
  let idCounter = 1;
  const bookingData = [];
  const startYear = 2022;
  const endYear = 2024;
  const objectIds = objects.value.map((obj) => obj.id);
  const guests = [
    "Гость 1",
    "Гость 2",
    "Гость 3",
    "Гость 4",
    "Гость 5",
    // Добавьте другие имена гостей
  ];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      // Создаём 3 бронирования на каждый месяц
      for (let i = 0; i < 3; i++) {
        const startDay = Math.floor(Math.random() * 28) + 1;
        const duration = Math.floor(Math.random() * 5) + 1; // От 1 до 5 дней
        const endDay = startDay + duration;
        const objectId = objectIds[Math.floor(Math.random() * objectIds.length)];
        const guest = guests[Math.floor(Math.random() * guests.length)];

        const startDate = new Date(year, month, startDay);
        const endDate = new Date(year, month, endDay);

        bookingData.push({
          id: idCounter++,
          guest,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          objectId,
        });
      }
    }
  }

  bookings.value = bookingData;
};

generateBookings();

const displayedDates = ref([]);

const currentDate = ref(new Date()); // Используем текущую дату

const daysBeforeTotal = 36; // Общее количество дней до текущей даты для скролла
const daysBeforeDisplay = 6; // Количество дней до текущей даты для отображения

const initDisplayedDates = () => {
  const dates = [];

  const daysAfter = Math.ceil(window.innerWidth / CELL_WIDTH); // Количество дней после текущей даты для заполнения экрана

  // Начальная дата - за daysBeforeTotal дней до текущей
  const startDate = new Date(currentDate.value.getTime() - daysBeforeTotal * 86400000);

  // Общее количество дней для отображения
  const totalDays = daysBeforeTotal + daysAfter + 1; // +1 для текущей даты

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    dates.push(date);
  }

  displayedDates.value = dates;

  // После отрисовки прокручиваем до текущей даты и обновляем метки месяцев
  nextTick(() => {
    scrollToCurrentDate();
    updateMonthMarkers();
  });
};

const scrollToCurrentDate = () => {
  const container = scrollContainer.value;
  if (container) {
    container.scrollLeft = (daysBeforeTotal - daysBeforeDisplay) * CELL_WIDTH;
  }
};

onMounted(() => {
  initDisplayedDates();
});

const dateLabel = (date) => {
  return date.getDate();
};

const isToday = (date) => {
  return isSameDay(date, currentDate.value);
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Метки месяцев
const monthMarkers = ref([]);

const updateMonthMarkers = () => {
  monthMarkers.value = [];
  for (let index = 0; index < displayedDates.value.length; index++) {
    const date = displayedDates.value[index];
    const prevDate = displayedDates.value[index - 1];
    const nextDate = displayedDates.value[index + 1];

    // Проверяем начало месяца
    if (index === 0 || date.getMonth() !== prevDate?.getMonth()) {
      // Добавляем метку над первым днём месяца
      monthMarkers.value.push({
        label: monthLabel(date),
        position: index * CELL_WIDTH,
        align: "right",
      });
    }

    // Проверяем конец месяца
    if (nextDate && date.getMonth() !== nextDate.getMonth()) {
      // Добавляем метку над последним днём текущего месяца
      monthMarkers.value.push({
        label: monthLabel(date),
        position: (index + 1) * CELL_WIDTH,
        align: "left",
      });
    }
  }
};

const monthLabel = (date) => {
  const options = { month: "long", year: "numeric" };
  return date.toLocaleDateString("ru-RU", options);
};

const getBookingsForObject = (objectId) => {
  return bookings.value.filter((booking) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    const displayStartDate = displayedDates.value[0];
    const displayEndDate = displayedDates.value[displayedDates.value.length - 1];

    // Проверяем, пересекается ли бронирование с текущим диапазоном отображаемых дат
    return booking.objectId === objectId && bookingEnd >= displayStartDate && bookingStart <= displayEndDate;
  });
};

const bookingStyle = (booking) => {
  const bookingStart = new Date(booking.startDate);
  const bookingEnd = new Date(booking.endDate);

  const displayStartDate = displayedDates.value[0];

  const effectiveStartDate = bookingStart > displayStartDate ? bookingStart : displayStartDate;

  const startOffsetDays = Math.floor((effectiveStartDate - displayStartDate) / 86400000);

  const durationInDays = Math.floor((bookingEnd - effectiveStartDate) / 86400000) + 1;

  const left = startOffsetDays * CELL_WIDTH;
  const width = durationInDays * CELL_WIDTH - 5;

  return {
    left: `${left}px`,
    width: `${width}px`,
  };
};

const scrollContainer = ref(null);

const handleScroll = () => {
  const container = scrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const scrollWidth = container.scrollWidth;
  const clientWidth = container.clientWidth;

  if (scrollLeft < 200) {
    prependDates();
  }

  if (scrollLeft + clientWidth > scrollWidth - 200) {
    appendDates();
  }
};

const prependDates = () => {
  const firstDate = displayedDates.value[0];
  const newDates = [];
  for (let i = 30; i >= 1; i--) {
    const date = new Date(firstDate.getTime() - i * 86400000);
    newDates.push(date);
  }
  displayedDates.value = newDates.concat(displayedDates.value);
  updateMonthMarkers();

  // Корректировка позиции скролла
  const scrollAdjustment = 30 * CELL_WIDTH;
  scrollContainer.value.scrollLeft += scrollAdjustment;
};

const appendDates = () => {
  const lastDate = displayedDates.value[displayedDates.value.length - 1];
  const newDates = [];
  for (let i = 1; i <= 30; i++) {
    const date = new Date(lastDate.getTime() + i * 86400000);
    newDates.push(date);
  }
  displayedDates.value = displayedDates.value.concat(newDates);
  updateMonthMarkers();
};

const totalWidth = computed(() => {
  return displayedDates.value.length * CELL_WIDTH;
});

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

<style scoped>
.month-marker {
  position: absolute;
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  display: flex;
  align-items: center;
}

.month-marker::before {
  content: "";
  display: none;
  width: 1px; /* Толщина чёрточки */
  height: 16px; /* Высота чёрточки */
  background-color: black;
  margin-right: 5px;
  transform: translateX(-1px);
}

.month-marker--before::before {
  display: block;
}
</style>
