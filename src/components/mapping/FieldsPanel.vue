<script setup>
import { getWizardContext } from "../useWizardState.js";
import FieldItem from "./FieldItem.vue";

const ctx = getWizardContext();
</script>

<template>
	<aside class="wx-fields-panel">
		<div class="wx-panel-content">
			<FieldItem
				v-for="field in ctx.config.fields"
				:key="field.id"
				:field="field"
			/>
		</div>
	</aside>
</template>

<style scoped>
.wx-fields-panel {
	display: flex;
	flex-direction: column;
	width: 280px;
	border-top: var(--wx-border);
	border-left: var(--wx-border);
	background: var(--wx-background);
	flex-shrink: 0;
	overflow: hidden;
}

.wx-panel-content {
	flex: 1;
	overflow-y: auto;
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

@media (max-width: 900px) {
	.wx-fields-panel {
		width: 240px;
	}
}
</style>
