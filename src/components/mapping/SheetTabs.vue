<script setup>
import { computed } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { Tabs } from "@svar-ui/vue-core";

const ctx = getWizardContext();

const sheets = computed(() =>
  (ctx.parsedData?.sheets ?? []).map((sheet) => ({
    label: sheet.name,
    id: sheet.name,
  })),
);
const activeSheet = computed(() => ctx.activeSheet || sheets.value[0]?.id);

function handleTabClick(ev) {
  ctx.selectSheet(String(ev.value));
}
</script>

<template>
  <div v-if="sheets.length > 1" class="wx-tabs" role="tablist">
    <Tabs
      :options="sheets"
      :value="activeSheet"
      :onchange="handleTabClick"
      type="top"
    />
  </div>
</template>

<style scoped>
.wx-tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0 1rem;
  background: var(--wx-background-alt);
  --wx-tabs-background: transparent;
}
</style>
