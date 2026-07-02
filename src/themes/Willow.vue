<script setup>
defineOptions({ name: "ThemesWillow" });

import { Willow } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: { type: Boolean, default: true },
});
</script>

<template>
    <Willow v-if="$slots.default" :fonts="props.fonts">
		<slot />
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style scoped>
:global(.wx-willow-theme) {
}
</style>
