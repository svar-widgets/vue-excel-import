<script setup>
import { inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import DropZone from "../ui/DropZone.vue";
import { parseExcelFile } from "@svar-ui/excel-import-store";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

async function handleFile(file) {
  ctx.file = file;
  ctx.stage = "processing";
  ctx.error = null;

  try {
    const data = await parseExcelFile(
      file,
      (progress) => {
        ctx.processingProgress = progress;
      },
      ctx.config.headerRow === false,
    );

    ctx.loadData(data);
    ctx.stage = "mapping";
  } catch (e) {
    ctx.error = e instanceof Error ? e.message : _("Failed to parse file");
    ctx.stage = "upload";
  }
}
</script>

<template>
  <div class="wx-upload">
    <DropZone
      :accept="ctx.config.accept ?? '.xlsx,.csv,.tsv'"
      :onfile="handleFile"
    />

    <div v-if="ctx.error" class="wx-error">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ ctx.error }}</span>
    </div>
  </div>
</template>

<style scoped>
.wx-upload {
  border-top: var(--wx-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex: 1;
  min-height: 0;
  padding: 24px;
  box-sizing: border-box;
}

.wx-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--wx-background-alt);
  border: 1px solid var(--wx-color-danger);
  border-radius: var(--wx-radius-major);
  color: var(--wx-color-danger);
  font-size: var(--wx-font-size);
}

.wx-error svg {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}
</style>
