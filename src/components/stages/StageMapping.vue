<script setup>
import SheetTabs from "../mapping/SheetTabs.vue";
import MappingLayout from "../mapping/MappingLayout.vue";
</script>

<template>
  <div class="wx-mapping">
    <SheetTabs />
    <MappingLayout />
  </div>
</template>

<style scoped>
.wx-mapping {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
