<script setup>
import { ref, inject } from "vue";

const props = defineProps({
	accept: { type: String, default: ".xlsx,.csv,.tsv" },
	disabled: { type: Boolean, default: false },
	onfile: { type: Function },
});

const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const isDragging = ref(false);
const fileInput = ref(null);
let dragCounter = 0;

function handleDragEnter(e) {
	e.preventDefault();
	if (!props.disabled) {
		dragCounter++;
		isDragging.value = true;
	}
}

function handleDragLeave(e) {
	e.preventDefault();
	dragCounter--;
	if (dragCounter <= 0) {
		dragCounter = 0;
		isDragging.value = false;
	}
}

function handleDragOver(e) {
	e.preventDefault();
}

function handleDrop(e) {
	e.preventDefault();
	dragCounter = 0;
	isDragging.value = false;

	if (props.disabled) return;

	const file = e.dataTransfer?.files[0];
	if (file && isValidFile(file)) {
		props.onfile?.(file);
	}
}

function handleFileSelect(e) {
	const target = e.target;
	const file = target.files?.[0];
	if (file) {
		props.onfile?.(file);
	}
	target.value = "";
}

function handleClick() {
	if (!props.disabled) {
		fileInput.value?.click();
	}
}

function handleKeydown(e) {
	if ((e.key === "Enter" || e.key === " ") && !props.disabled) {
		e.preventDefault();
		fileInput.value?.click();
	}
}

function isValidFile(file) {
	if (!props.accept) return true;
	const extensions = props.accept
		.split(",")
		.map(ext => ext.trim().toLowerCase());
	const fileName = file.name.toLowerCase();
	return extensions.some(ext => fileName.endsWith(ext));
}
</script>

<template>
	<div
		:class="[
			'wx-dropzone',
			{ 'wx-dragging': isDragging, 'wx-disabled': disabled },
		]"
		role="button"
		:tabindex="disabled ? -1 : 0"
		@dragenter="handleDragEnter"
		@dragleave="handleDragLeave"
		@dragover="handleDragOver"
		@drop="handleDrop"
		@click="handleClick"
		@keydown="handleKeydown"
	>
		<input
			ref="fileInput"
			type="file"
			:accept="accept"
			:disabled="disabled"
			class="wx-file-input"
			@change="handleFileSelect"
		/>

		<div class="wx-dropzone-icon-wrap">
			<svg
				class="wx-dropzone-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="17 8 12 3 7 8" />
				<line x1="12" y1="3" x2="12" y2="15" />
			</svg>
		</div>

		<div class="wx-dropzone-text">
			<p class="wx-dropzone-line">
				<span class="wx-dropzone-link">{{ _("Click to upload") }}</span>
				<span class="wx-dropzone-rest">{{
					_("or drag and drop your file")
				}}</span>
			</p>
			<p class="wx-dropzone-hint">
				{{ _("Excel files (.xlsx) or CSV") }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.wx-dropzone {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	width: 600px;
	height: 300px;
	padding: 58px 142px;
	box-sizing: border-box;
	border: 2px dashed var(--wx-border-color);
	border-radius: var(--wx-radius-major);
	background: var(--wx-excel-dropzone-bg);
	cursor: pointer;
	transition:
		border-color 0.15s,
		background-color 0.15s;
}

.wx-dropzone:hover:not(.wx-disabled) {
	border-color: var(--wx-excel-dropzone-border-hover);
}

.wx-dropzone:focus {
	outline: none;
	border-color: var(--wx-color-primary);
}

.wx-dropzone.wx-dragging {
	border-color: var(--wx-color-primary);
	background: var(--wx-color-primary-selected);
}

.wx-dropzone.wx-disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.wx-file-input {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.wx-dropzone-icon-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: 100px;
	background: var(--wx-excel-upload-bg);
	color: var(--wx-color-link);
	flex-shrink: 0;
}

.wx-dropzone-icon {
	width: 24px;
	height: 24px;
}

.wx-dropzone-text {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.wx-dropzone-line {
	margin: 0;
	font-size: var(--wx-font-size, 14px);
	line-height: 20px;
	color: var(--wx-color-font);
	text-align: center;
}

.wx-dropzone-link {
	color: var(--wx-color-link);
	font-weight: var(--wx-font-weight-md, 600);
	margin-right: 4px;
}

.wx-dropzone-rest {
	font-weight: var(--wx-font-weight, 400);
}

.wx-dropzone-hint {
	margin: 0;
	font-size: var(--wx-font-size, 14px);
	line-height: 20px;
	color: var(--wx-color-font);
	text-align: center;
}
</style>
