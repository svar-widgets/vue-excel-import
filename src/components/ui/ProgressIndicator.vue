<script setup>
import { computed } from 'vue';

const props = defineProps({
	progress: { type: Number },
	message: { default: 'Processing...' },
});

const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress)));
</script>

<template>
	<div class="wx-progress">
		<div class="wx-progress-message">{{ message }}</div>
		<div class="wx-progress-bar">
			<div
				class="wx-progress-fill"
				:style="{ width: clampedProgress + '%' }"
			></div>
		</div>
		<div class="wx-progress-percent">{{ Math.round(clampedProgress) }}%</div>
	</div>
</template>

<style scoped>
.wx-progress {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 2rem;
}

.wx-progress-message {
	font-size: var(--wx-font-size);
	color: var(--wx-color-font-alt);
}

.wx-progress-bar {
	width: 100%;
	max-width: 300px;
	height: 8px;
	background: var(--wx-color-disabled-alt);
	border-radius: var(--wx-border-radius);
	overflow: hidden;
}

.wx-progress-fill {
	height: 100%;
	background: var(--wx-color-primary);
	border-radius: var(--wx-border-radius);
	transition: width 0.2s ease;
}

.wx-progress-percent {
	font-size: var(--wx-font-size);
	font-weight: var(--wx-font-weight-md);
	color: var(--wx-color-font);
}
</style>
