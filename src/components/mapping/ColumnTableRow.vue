<script setup>
import { computed } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { formatCellValue } from "@svar-ui/excel-import-store";

const props = defineProps({
  row: { type: Array },
  columns: { type: Array },
  rowIndex: { type: Number },
});

const ctx = getWizardContext();

const dateFormats = computed(() => {
  const formats = new Map();
  for (const field of ctx.config.fields) {
    const columnId = ctx.currentMappings[field.id];
    if (columnId && field.dateFormat) {
      formats.set(columnId, field.dateFormat);
    }
  }
  return formats;
});
</script>

<template>
  <tr class="wx-row">
    <td
      v-for="column in columns"
      :key="column.id"
      class="wx-cell"
      :class="{
        'wx-highlighted': ctx.mappedColumns.has(column.id),
        'wx-right-align':
          column.detectedType === 'number' || column.detectedType === 'date',
      }"
    >
      <span class="wx-cell-value" :title="String(row[column.index] ?? '')">
        {{ formatCellValue(row[column.index], 50, dateFormats.get(column.id)) }}
      </span>
    </td>
  </tr>
</template>

<style scoped>
.wx-row {
  border-bottom: var(--wx-border);
}

.wx-cell {
  padding: 8px 12px;
  line-height: 16px;
  font-size: var(--wx-font-size-sm);
  color: var(--wx-color-font);
  max-width: 200px;
  transition: background-color 0.15s;
  border-right: var(--wx-border);
}

.wx-cell.wx-highlighted {
  background: var(--wx-excel-highlight);
}

.wx-cell.wx-right-align {
  text-align: right;
}

.wx-cell-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wx-cell:last-child {
  border-right: none;
}
</style>
