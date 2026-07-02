<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { getAutoDetectionSummaryItems } from "@svar-ui/excel-import-store";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const autoDetectionItems = computed(() =>
	getAutoDetectionSummaryItems(ctx.autoDetections, ctx.config.fields)
);
const hasAutoDetections = computed(() => autoDetectionItems.value.length > 0);
const hasErrors = computed(() => ctx.validationResult.errors.length > 0);

const autoDetectionMessage = computed(() => {
	if (!hasAutoDetections.value) return "";

	const items = autoDetectionItems.value
		.map(item =>
			formatMessage(_("Auto-detected item"), {
				field: item.fieldLabel,
				column: item.columnId,
			})
		)
		.join(", ");

	return formatMessage(_("Auto-detected mappings"), { items });
});

const errorMessage = computed(() =>
	hasErrors.value
		? ctx.validationResult.errors.map(e => e.message).join(". ")
		: ""
);

function handleClearAll() {
	ctx.clearAllMappings();
}

function formatMessage(message, values) {
	return message.replace(/\{(\w+)\}/g, (match, key) =>
		String(values[key] ?? match)
	);
}
</script>

<template>
	<div
		v-if="hasAutoDetections || hasErrors"
		class="wx-status"
		:class="{
			'wx-info': hasAutoDetections && !hasErrors,
			'wx-warning': hasErrors,
		}"
		role="alert"
	>
		<div class="wx-status-content">
			<template v-if="hasErrors">
				<svg
					class="wx-status-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
				<span class="wx-status-message">{{ errorMessage }}</span>
			</template>
			<template v-else-if="hasAutoDetections">
				<svg
					class="wx-status-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line>
				</svg>
				<span class="wx-status-message">{{
					autoDetectionMessage
				}}</span>
				<button
					type="button"
					class="wx-clear-link"
					@click="handleClearAll"
				>
					{{ _("Clear all") }}
				</button>
			</template>
		</div>
	</div>
</template>

<style scoped>
.wx-status {
	padding: 0.75rem 1rem;
	font-size: var(--wx-font-size);
	flex-shrink: 0;
}

.wx-status.wx-info {
	background: var(--wx-excel-highlight);
	color: var(--wx-color-primary);
}

.wx-status.wx-warning {
	background: var(--wx-excel-warning-bg);
	color: var(--wx-excel-warning);
}

.wx-status-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.wx-status-icon {
	width: 1.125rem;
	height: 1.125rem;
	flex-shrink: 0;
}

.wx-status-message {
	flex: 1;
}

.wx-clear-link {
	padding: 0;
	border: none;
	background: none;
	color: inherit;
	font-size: var(--wx-font-size);
	text-decoration: underline;
	cursor: pointer;
	opacity: 0.8;
}

.wx-clear-link:hover {
	opacity: 1;
}
</style>
