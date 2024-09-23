<template>
  <div class="relative w-[216px] h-[38px]">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 h-full">
      <slot name="before"></slot>
    </div>
    <input
      type="text"
      class="block w-full pl-10 pr-3 py-2 bg-gray-100 rounded-[10px] h-full"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:model-value', $event.target.value)"
    />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 h-full">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  placeholder: {
    type: String,
    default: "",
  },
});

defineEmits(["update:model-value"]);
</script>
