<script setup>
defineOptions({ name: "DemoLocales" });
import { ref } from "vue";
import { Button, Locale } from "@svar-ui/vue-core";
import { ExcelImport } from "../../src/";

import { en, de, es, fr, it, jp, pt, ru, zh } from "@svar-ui/excel-import-locales";

const isVisible = ref(false);
const lang = ref("en");

const locales = { en, de, es, fr, it, jp, pt, ru, zh };
const localeOptions = [
  { id: "en", label: "EN" },
  { id: "de", label: "DE" },
  { id: "es", label: "ES" },
  { id: "fr", label: "FR" },
  { id: "it", label: "IT" },
  { id: "jp", label: "JP" },
  { id: "pt", label: "PT" },
  { id: "ru", label: "RU" },
  { id: "zh", label: "ZH" },
];

const getWords = (lang) => locales[lang] || en;

const config = {
  fields: [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
  ],
  onimport: (data, result) => console.log("Imported:", data, result),
  onclose: () => (isVisible.value = false),
};

function openLang(value) {
  lang.value = value;
  isVisible.value = true;
}
</script>

<template>
  <div class="demo-box">
    <div class="toolbar">
      <Button
        v-for="locale in localeOptions"
        :key="locale.id"
        :type="lang == locale.id ? 'primary' : 'secondary'"
        :onclick="() => openLang(locale.id)"
      >
        Open {{ locale.label }}
      </Button>
    </div>

    <Locale v-if="isVisible" :words="getWords(lang)">
      <ExcelImport :key="lang" v-bind="config" />
    </Locale>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
