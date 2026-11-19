<script setup>
import { ref } from "vue";
import { Button } from "@svar-ui/vue-core";
import { ExcelImport } from "../../src/";

const isVisible = ref(false);

const config = {
  fields: [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
  ],
  onimport: (data, result) => console.log("Imported:", data, result),
  onclose: () => (isVisible.value = false),
  autoClose: true,
};
</script>

<template>
  <div class="demo-box">
    <Button type="primary" :onclick="() => (isVisible = !isVisible)">
      Click me to open
    </Button>
    <ExcelImport v-if="isVisible" v-bind="config" />
  </div>
</template>
