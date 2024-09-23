<template>
  <div class="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke-width="8"
        r="40"
        stroke-dasharray="188.49555921538757 64.83185307179586"
        class="stroke-gray-700"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="0.6666666666666666s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
    <span v-if="title" class="text-gray-700">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: "LoadingIndicator",
  props: {
    title: {
      type: String,
      default: "Please wait, loading",
    },
  },
  data() {
    return {
      dots: 0,
      interval: null,
    };
  },
  created() {
    this.interval = setInterval(() => {
      if (this.dots >= 3) {
        this.dots = 0;
      } else {
        this.dots += 1;
      }
    }, 100);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>
