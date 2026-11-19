<script setup>
import { inject } from "vue";
import { getWizardContext } from "./useWizardState.js";

const props = defineProps({
  title: { type: String, default: null },
});

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

function handleClose() {
  ctx.close();
}
</script>

<template>
  <header class="wx-header">
    <h2 class="wx-title">{{ title || _("Import from Excel") }}</h2>
    <button
      type="button"
      class="wx-close"
      :aria-label="_('Close wizard')"
      @click="handleClose"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </header>
</template>

<style scoped>
.wx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
}

.wx-title {
  margin: 0;
  font-size: var(--wx-font-size-hd);
  font-weight: var(--wx-font-weight-md);
  color: var(--wx-color-font);
}

.wx-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: var(--wx-radius-major);
  color: var(--wx-color-font-alt);
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.wx-close:focus-visible {
  outline: none;
}

.wx-close:hover {
  background: var(--wx-background-hover);
  color: var(--wx-color-font);
}

.wx-close svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
