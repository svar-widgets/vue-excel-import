<script setup>
import { useAttrs } from "vue";
import { WizardContext, setWizardContext } from "./useWizardState.js";
import ModalOverlay from "./ui/ModalOverlay.vue";
import Layout from "./Layout.vue";
import { Locale } from "@svar-ui/vue-core";
import { en } from "@svar-ui/excel-import-locales";

const attrs = useAttrs();

const ctx = new WizardContext({ ...attrs });
setWizardContext(ctx);
</script>

<template>
  <Locale :words="en" :optional="true">
    <ModalOverlay :onclose="() => ctx.close()">
      <Layout />
    </ModalOverlay>
  </Locale>
</template>
