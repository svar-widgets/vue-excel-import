<script setup>
import { computed, inject } from "vue";
import { getWizardContext } from "../useWizardState.js";
import { Button } from "@svar-ui/vue-core";

const ctx = getWizardContext();
const locale = inject("wx-i18n");
const _ = locale.getGroup("excel-import");

const result = computed(() => ctx.importResult);

function handleClose() {
	ctx.close();
}
</script>

<template>
	<div class="wx-complete">
		<div class="wx-card">
			<div class="wx-success">
				<div class="wx-success-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</div>

				<div class="wx-text">
					<p class="wx-title">{{ _("Success!") }}</p>

					<template v-if="result">
						<div class="wx-paragraph">
							<p class="wx-subtitle">
								{{ _("Successfully imported") }}
							</p>
							<p class="wx-count">
								{{ result.imported.toLocaleString() }}
								{{ _("rows") }}
							</p>
						</div>

						<p v-if="result.skipped > 0" class="wx-skipped">
							{{ result.skipped }}
							{{ _("rows skipped") }}
						</p>
					</template>
				</div>
			</div>

			<details
				v-if="result && result.errors.length > 0"
				class="wx-error-details"
			>
				<summary>{{ _("View skipped rows") }}</summary>
				<ul class="wx-error-list">
					<li
						v-for="(error, index) in result.errors.slice(0, 10)"
						:key="index"
					>
						{{ _("Row") }} {{ error.row }}: {{ error.reason }}
					</li>
					<li v-if="result.errors.length > 10" class="wx-more">
						...{{ _("and") }}
						{{ result.errors.length - 10 }}
						{{ _("more") }}
					</li>
				</ul>
			</details>

			<Button type="primary" :onclick="handleClose">
				{{ _("View imported data") }}
			</Button>
		</div>
	</div>
</template>

<style scoped>
.wx-complete {
	display: flex;
	flex: 1;
	min-height: 0;
	align-items: center;
	justify-content: center;
	padding: 24px;
	box-sizing: border-box;
}

.wx-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32px;
	padding: 56px 140px;
	border-radius: 6px;
}

.wx-success {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
}

.wx-success-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: 100px;
	background: rgba(0, 209, 154, 0.1);
	color: var(--wx-color-success);
}

.wx-success-icon svg {
	width: 28px;
	height: 28px;
}

.wx-text {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.wx-title {
	margin: 0;
	font-size: 18px;
	font-weight: var(--wx-font-weight-md);
	line-height: 20px;
	color: var(--wx-color-font);
	text-align: center;
}

.wx-paragraph {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	margin-top: 8px;
}

.wx-subtitle {
	margin: 0;
	font-size: var(--wx-font-size);
	line-height: 20px;
	color: var(--wx-color-font);
}

.wx-count {
	margin: 0;
	font-size: 24px;
	font-weight: var(--wx-font-weight-md);
	line-height: 20px;
	color: var(--wx-color-success);
}

.wx-skipped {
	margin: 8px 0 0;
	font-size: var(--wx-font-size-sm);
	color: var(--wx-color-font-alt);
}

.wx-error-details {
	max-width: 400px;
	text-align: left;
}

.wx-error-details summary {
	cursor: pointer;
	font-size: var(--wx-font-size);
	color: var(--wx-color-font-alt);
	text-align: center;
}

.wx-error-details summary:hover {
	color: var(--wx-color-font);
}

.wx-error-list {
	margin: 0.5rem 0 0;
	padding-left: 1.25rem;
	font-size: var(--wx-font-size-sm);
	color: var(--wx-color-font-alt);
	max-height: 150px;
	overflow-y: auto;
}

.wx-error-list li {
	margin: 0.25rem 0;
}

.wx-error-list .wx-more {
	font-style: italic;
	color: var(--wx-color-font-disabled);
}
</style>
