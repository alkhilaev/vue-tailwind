<script>
import { defineComponent } from "vue";
import "@/assets/swagger-ui/swagger-ui.css";
import SwaggerUI from "@/assets/swagger-ui/swagger-ui-es-bundle.js";
import SwaggerUIStandalonePreset from "@/assets/swagger-ui/swagger-ui-standalone-preset.js";

export default defineComponent({
  async mounted() {
    // Импорт файла спецификации
    const spec = await import("@/assets/spec.json"); // динамическое импортирование JSON файла

    SwaggerUI({
      spec, // используем объект спецификации
      dom_id: "#swagger-ui",
      presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
      layout: "StandaloneLayout",
    });
  },
});
</script>

<template>
  <div id="swagger-ui"></div>
  <div class="container mx-auto px-5 py-5">
    <router-link :to="{ name: 'home' }" class="bg-primary text-white px-4 py-3 rounded-xl">
      Go back
    </router-link>
  </div>
</template>
