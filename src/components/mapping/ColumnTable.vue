<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { getPreviewRows } from "@svar-ui/excel-import-store";
import ColumnTableHeader from "./ColumnTableHeader.vue";
import ColumnTableRow from "./ColumnTableRow.vue";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const sheet = computed(() => ctx.currentSheet);
const columns = computed(() => sheet.value?.columns ?? []);
const previewRowCount = computed(() => ctx.config.previewRowCount ?? 10);
const previewRows = computed(() =>
  sheet.value ? getPreviewRows(sheet.value, previewRowCount.value) : [],
);
</script>

<template>
  <div class="wx-table-wrap">
    <div
      v-if="sheet && columns.length > 0 && previewRows.length > 0"
      class="wx-table-scroll"
    >
      <table class="wx-table">
        <thead>
          <tr>
            <ColumnTableHeader
              v-for="column in columns"
              :key="column.id"
              :column="column"
            />
          </tr>
        </thead>
        <tbody>
          <ColumnTableRow
            v-for="(row, index) in previewRows"
            :key="index"
            :row="row"
            :columns="columns"
            :row-index="index"
          />
        </tbody>
      </table>
    </div>
    <div v-else class="wx-empty">
      {{ _("No data available") }}
    </div>
  </div>
</template>

<style scoped>
.wx-table-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-top: var(--wx-border);
}

.wx-table-scroll {
  flex: 1;
  overflow: auto;
}

.wx-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--wx-font-size);
}

.wx-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.wx-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
