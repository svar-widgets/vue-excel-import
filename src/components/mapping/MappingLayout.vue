<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { Button } from "@svar-ui/vue-core";
import { getPreviewRows } from "@svar-ui/excel-import-store";
import ColumnTable from "./ColumnTable.vue";
import FieldsPanel from "./FieldsPanel.vue";
import StatusBar from "./StatusBar.vue";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const sheet = computed(() => ctx.currentSheet);
const previewRowCount = computed(() => ctx.config.previewRowCount ?? 10);
const previewRows = computed(() =>
	sheet.value ? getPreviewRows(sheet.value, previewRowCount.value) : []
);
const totalRows = computed(() => sheet.value?.totalRows ?? 0);
const validation = computed(() => ctx.validationResult);
const showRightPanel = computed(() => ctx.config.selectors !== "top");

function handleImport() {
	ctx.performImport();
}
</script>

<template>
	<StatusBar v-if="previewRows.length > 0" />
	<div class="wx-layout">
		<div class="wx-body">
			<div class="wx-table-area">
				<ColumnTable />
			</div>
			<FieldsPanel
				v-if="previewRows.length > 0 && showRightPanel"
			/>
		</div>
		<div class="wx-footer">
			<span class="wx-footer-info">
				{{ _("Showing") }}
				{{ previewRows.length }}
				{{ _("of") }}
				{{ totalRows }}
				{{ _("rows") }}
			</span>
			<Button
				type="primary"
				:disabled="!validation.valid || previewRows.length === 0"
				:onclick="handleImport"
			>
				<template v-if="validation.valid">
					{{ _("Import") }} {{ totalRows }} {{ _("rows") }}
				</template>
				<template v-else>
					{{ _("Import") }}
				</template>
			</Button>
		</div>
	</div>
</template>

<style scoped>
.wx-layout {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}

.wx-body {
	display: flex;
	flex: 1;
	overflow: hidden;
}

.wx-table-area {
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.wx-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	border-top: var(--wx-border);
	flex-shrink: 0;
}

.wx-footer-info {
	font-size: var(--wx-font-size-sm);
	color: var(--wx-color-font-alt);
}

@media (max-width: 768px) {
	.wx-body {
		flex-direction: column;
	}

	.wx-body :deep(.wx-fields-panel) {
		width: 100%;
		max-height: 300px;
		border-left: none;
		border-top: var(--wx-border);
	}
}
</style>
