<script setup>
import { ref } from "vue";
import { Button } from "@svar-ui/vue-core";
import { ExcelImport } from "../../src/";

const isVisible = ref(false);

const config = {
  fields: [
    { id: "name", label: "Name", required: true },
    { id: "email", label: "Email" },
    { id: "comments", label: "Comments" },
  ],
  onimport: (data, result) => console.log("Imported:", data, result),
  onclose: () => (isVisible.value = false),
  validate: (mappings) => {
    const errors = [];
    if (mappings.name === null) {
      errors.push({ fieldId: "name", message: "Name is required" });
    }
    if (mappings.email === null) {
      errors.push({ fieldId: "email", message: "Email is required" });
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  },
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
