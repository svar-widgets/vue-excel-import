<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import Dropdown from "../ui/Dropdown.vue";
import ColumnIcon from "./ColumnIcon.vue";

const props = defineProps({
  column: { type: Object },
});

const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const ctx = getWizardContext();

// Find which field is mapped to this column
const mappedFieldId = computed(() => {
  for (const [fieldId, columnId] of Object.entries(ctx.currentMappings)) {
    if (columnId === props.column.id) {
      return fieldId;
    }
  }
  return null;
});

const isRightAligned = computed(
  () =>
    props.column.detectedType === "number" ||
    props.column.detectedType === "date",
);

const showDropdown = computed(() => ctx.config.selectors !== "right");

// Build dropdown options from fields
const dropdownOptions = computed(() => [
  { id: "__skip__", label: _("Skip"), default: true },
  ...ctx.config.fields.map((field) => {
    const mappedTo = ctx.currentMappings[field.id];
    const isUsed = mappedTo !== null && mappedTo !== props.column.id;
    return {
      id: field.id,
      label: field.label,
      used: isUsed,
    };
  }),
]);

function handleChange({ value }) {
  const fieldId = typeof value === "string" ? value : String(value);
  // First, clear any existing mapping to this column
  if (mappedFieldId.value) {
    ctx.setFieldMapping(mappedFieldId.value, null);
  }

  // Then set the new mapping (this will also clear the field's previous column mapping)
  if (fieldId && fieldId !== "__skip__") {
    ctx.setFieldMapping(fieldId, props.column.id);
  }
}
</script>

<template>
  <th
    class="wx-col-header"
    :class="{
      'wx-highlighted': mappedFieldId,
      'wx-mapped': mappedFieldId !== null,
      'wx-right-align': isRightAligned,
    }"
  >
    <div v-if="showDropdown" class="wx-col-dropdown">
      <Dropdown
        :options="dropdownOptions"
        :value="mappedFieldId ?? '__skip__'"
        :onchange="handleChange"
      />
    </div>

    <div class="wx-col-info">
      <span
        v-if="column.detectedType !== 'text'"
        class="wx-col-type"
        :title="column.detectedType"
      >
        <ColumnIcon :type="column.detectedType" />
      </span>
      <span class="wx-col-name" :title="column.header">
        {{ column.header || `Column ${column.id}` }}
      </span>
    </div>
  </th>
</template>

<style scoped>
.wx-col-header {
  padding: 8px;
  border-bottom: var(--wx-border);
  border-right: var(--wx-border);
  min-width: 140px;
}
.wx-col-header:last-child {
  border-right: none;
}

.wx-col-header.wx-mapped {
  background: var(--wx-excel-highlight);
}

.wx-col-header.wx-right-align .wx-col-info {
  justify-content: flex-end;
}

.wx-col-dropdown {
  margin-bottom: 8px;
}

.wx-col-info {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;
}

.wx-col-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--wx-color-font);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wx-col-type {
  font-size: var(--wx-font-size-sm);
  color: var(--wx-color-font-disabled);
  flex-shrink: 0;
}
</style>
