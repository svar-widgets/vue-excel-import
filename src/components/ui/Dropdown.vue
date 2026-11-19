<script setup>
defineOptions({ name: "ExcelImportUiDropdown" });

import { RichSelect } from "@svar-ui/vue-core";

const props = defineProps({
  options: { type: Array, default: () => [] },
  value: { default: undefined },
  placeholder: { type: String, default: "Select..." },
  disabled: { type: Boolean, default: false },
  onchange: { type: Function },
});
</script>

<template>
  <RichSelect
    :dropdown="{ trackScroll: true }"
    :options="props.options"
    :value="props.value"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :onchange="props.onchange"
  >
    <template #default="{ option }">
      <div
        :class="{
          'wx-used': option?.used,
          'wx-default': option?.default,
        }"
      >
        {{ option?.label }}
        <i v-if="option?.used" class="wxi-check"></i>
      </div>
    </template>
  </RichSelect>
</template>

<style scoped>
.wx-used {
  font-weight: bold;
  width: 100%;
}
.wx-used i {
  float: right;
}
.wx-default {
  color: var(--wx-color-font-alt);
}
</style>
