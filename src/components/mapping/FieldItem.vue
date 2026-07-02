<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import Dropdown from "../ui/Dropdown.vue";
import { formatCellValue } from "@svar-ui/excel-import-store";

const props = defineProps({
	field: { type: Object },
});

const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const ctx = getWizardContext();

const currentMapping = computed(() => ctx.currentMappings[props.field.id] ?? null);
const columns = computed(() => ctx.currentSheet?.columns ?? []);

const hasError = computed(() =>
	ctx.validationResult.errors.some(e => e.fieldId === props.field.id)
);

// Get preview value from the mapped column
const previewValue = computed(() => {
	if (!currentMapping.value || !ctx.currentSheet) return null;
	const col = ctx.currentSheet.columns.find(c => c.id === currentMapping.value);
	if (!col || col.sampleValues.length === 0) return null;
	return formatCellValue(col.sampleValues[0]);
});

// Find which field is using a column
const getFieldUsingColumn = (colId) => {
	for (const [fieldId, mappedColId] of Object.entries(ctx.currentMappings)) {
		if (mappedColId === colId && fieldId !== props.field.id) {
			return fieldId;
		}
	}
	return null;
};

// Build dropdown options
const dropdownOptions = computed(() => [
	{ id: "__skip__", label: _("None"), default: true },
	...columns.value.map(col => {
		const usedByFieldId = getFieldUsingColumn(col.id);
		return {
			id: col.id,
			label: col.header || `Column ${col.id}`,
			used: usedByFieldId !== null,
		};
	}),
]);

function handleChange({ value }) {
	const colId = typeof value === "string" ? value : String(value);
	// If selecting a column that's already used, clear the other field's mapping
	if (colId !== "__skip__") {
		const usedByFieldId = getFieldUsingColumn(colId);
		if (usedByFieldId) {
			ctx.setFieldMapping(usedByFieldId, null);
		}
		ctx.setFieldMapping(props.field.id, colId);
	} else {
		ctx.setFieldMapping(props.field.id, null);
	}
}
</script>

<template>
	<div
		class="wx-field"
		:class="{
			'wx-error': hasError,
			'wx-mapped': currentMapping !== null,
		}"
	>
		<div class="wx-field-label">
			<span class="wx-field-name" :class="{ 'wx-field-warning': hasError }">{{ field.label }}</span>
			<span
				v-if="(field.required && !currentMapping) || hasError"
				class="wx-field-required"
				:title="_('Required field')"
			>*</span>
		</div>

		<div class="wx-field-dropdown">
			<Dropdown
				:options="dropdownOptions"
				:value="currentMapping || '__skip__'"
				:onchange="handleChange"
			/>
		</div>

		<div v-if="previewValue" class="wx-field-preview">
			&#8627; {{ previewValue }}
		</div>
	</div>
</template>

<style scoped>
.wx-field {
	padding: 8px 12px;
	border-radius: var(--wx-radius-major);
	transition: background-color 0.15s;
}

.wx-field:hover {
	background: var(--wx-background-alt);
}

.wx-field.wx-mapped {
	background: var(--wx-excel-highlight);
}

.wx-field-label {
	gap: 8px;
	margin-bottom: 8px;
	font-size: var(--wx-font-size);
	font-weight: var(--wx-font-weight-md);
	color: var(--wx-color-font);
}

.wx-field-name {
	flex: 1;
}

.wx-field-required {
	color: var(--wx-color-danger);
	font-size: var(--wx-font-size-sm);
}

.wx-field-dropdown {
	margin-bottom: 8px;
}

.wx-field-dropdown :deep(.wx-dropdown) {
	width: 100%;
}

.wx-field-preview {
	font-size: var(--wx-font-size-sm);
	color: var(--wx-color-font-alt);
	padding-left: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
