<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { drag } from "../../directives/drag.js";

const vDrag = {
	mounted(el, binding) {
		el._dragAction = drag(el, binding.value);
	},
	updated(el, binding) {
		el._dragAction?.update(binding.value);
	},
	unmounted(el) {
		el._dragAction?.destroy();
	},
};

const props = defineProps({
	closeOnBackdrop: { type: Boolean, default: false },
	closeOnEscape: { type: Boolean, default: true },
	isDraggable: { type: Boolean, default: true },
	onclose: { type: Function },
});

const dialogEl = ref(null);

function handleClose() {
	props.onclose?.();
}

function handleBackdropClick(e) {
	if (props.closeOnBackdrop && e.target === dialogEl.value) {
		handleClose();
	}
}

function handleKeydown(e) {
	if (props.closeOnEscape && e.key === "Escape") {
		e.preventDefault();
		handleClose();
	}
}

onMounted(() => {
	if (dialogEl.value) {
		dialogEl.value.showModal();
	}
	document.body.style.overflow = "hidden";
});

onUnmounted(() => {
	document.body.style.overflow = "";
});
</script>

<template>
	<dialog
		ref="dialogEl"
		class="wx-modal"
		@click="handleBackdropClick"
		@keydown="handleKeydown"
		@cancel.prevent="handleClose"
	>
		<div
			v-if="isDraggable"
			class="wx-modal-content"
			role="dialog"
			v-drag="{ handle: '.wx-header', bounds: true }"
		>
			<slot />
		</div>
		<div v-else class="wx-modal-content" role="dialog">
			<slot />
		</div>
	</dialog>
</template>

<style scoped>
.wx-modal {
	position: fixed;
	inset: 0;
	width: 100vw;
	height: 100vh;
	max-width: 100vw;
	max-height: 100vh;
	padding: 0;
	margin: 0;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
}

.wx-modal::backdrop {
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
}

.wx-modal-content {
	width: min(95vw, 1100px);
	height: min(90vh, 624px);
	background: var(--wx-background);
	border-radius: var(--wx-radius-major);
	box-shadow: var(--wx-shadow-medium);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	transition: box-shadow 0.15s ease;
}

@media (max-width: 768px) {
	.wx-modal-content {
		width: 100vw;
		height: 100vh;
		border-radius: 0;
	}
}
</style>
