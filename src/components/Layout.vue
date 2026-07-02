<script setup>
defineOptions({ name: "ExcelImportLayout" });

import { getWizardContext } from "./useWizardState.js";
import ImportHeader from "./ImportHeader.vue";
import StageUpload from "./stages/StageUpload.vue";
import StageProcessing from "./stages/StageProcessing.vue";
import StageMapping from "./stages/StageMapping.vue";
import StageComplete from "./stages/StageComplete.vue";
import { popupContainer } from "@svar-ui/vue-core";

const vPopupContainer = popupContainer;

const ctx = getWizardContext();
</script>

<template>
	<div class="wx-excel-import" v-popup-container>
		<ImportHeader />

		<div class="wx-content">
			<StageUpload v-if="ctx.stage === 'upload'" />
			<StageProcessing v-else-if="ctx.stage === 'processing'" />
			<StageMapping v-else-if="ctx.stage === 'mapping'" />
			<StageComplete v-else-if="ctx.stage === 'complete'" />
		</div>
	</div>
</template>

<style scoped>
.wx-excel-import {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.wx-content {
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

:global(.wx-willow-theme) .wx-excel-import {
	--wx-excel-highlight: #f0f6fa;
	--wx-excel-warning-bg: #fffaea;
	--wx-excel-warning: var(--wx-color-warning);
	--wx-excel-dropzone-bg: rgba(230, 230, 230, 0.1);
	--wx-excel-dropzone-border-hover: var(--wx-color-font-disabled);
	--wx-excel-upload-bg: var(--wx-background-alt);
}

:global(.wx-willow-dark-theme) .wx-excel-import {
	--wx-excel-highlight: #303539;
	--wx-excel-warning-bg: #3a372c;
	--wx-excel-warning: #c9a228;
	--wx-excel-dropzone-bg: rgba(255, 255, 255, 0.02);
	--wx-excel-dropzone-border-hover: var(--wx-color-disabled-alt);
	--wx-excel-upload-bg: var(--wx-excel-highlight);
}
</style>
