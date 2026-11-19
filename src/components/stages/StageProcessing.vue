<script setup>
import { inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import ProgressIndicator from "../ui/ProgressIndicator.vue";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");
</script>

<template>
  <div class="wx-processing">
    <ProgressIndicator
      :progress="ctx.processingProgress"
      :message="_('Parsing Excel file...')"
    />

    <p v-if="ctx.file" class="wx-filename">{{ ctx.file.name }}</p>
  </div>
</template>

<style scoped>
.wx-processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  gap: 1rem;
}

.wx-filename {
  margin: 0;
  font-size: var(--wx-font-size);
  color: var(--wx-color-font-alt);
}
</style>
