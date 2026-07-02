<div align="center">

# SVAR Vue Excel Import

</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/@svar-ui/vue-excel-import.svg)](https://www.npmjs.com/package/@svar-ui/vue-excel-import)
[![License](https://img.shields.io/github/license/svar-widgets/vue-excel-import)](https://github.com/svar-widgets/vue-excel-import/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/vue-excel-import.svg)](https://www.npmjs.com/package/@svar-ui/vue-excel-import)

</div>

[SVAR Vue Excel Import](https://svar.dev/) is a modal import wizard for Vue apps. It parses `.xlsx`, `.csv`, and `.tsv` files, lets the end user map source columns to your application fields, transforms rows into keyed objects, and returns the imported data to your app.

The widget comes with automatic column-to-field detection, multi-sheet support, type conversion, custom validation, full TypeScript support, and flexible CSS styling.

### ✨ Key Features

- Modal import wizard for `.xlsx`, `.csv`, and `.tsv` files
- Automatic column-to-field mapping with header and keyword detection
- Multi-sheet workbook support 
- Light and dark themes
- Full TypeScript support

### :hammer_and_wrench: How to Use

To install SVAR Vue Excel Import:

```
npm install @svar-ui/vue-excel-import
```

To use the widget, simply import the package and include the component in your Vue file:

```vue
<script setup>
import { ref } from "vue";
import { ExcelImport } from "@svar-ui/vue-excel-import";

const open = ref(false);

const config = {
	fields: [
		{ id: "name", label: "Name", required: true },
		{ id: "email", label: "Email", required: true },
		{ id: "phone", label: "Phone" },
	],
	onimport: (rows, result) => {
		console.log("Imported rows:", rows, result);
	},
	onclose: () => (open.value = false),
};
</script>

<template>
	<button @click="open = true">Import Excel</button>

	<ExcelImport v-if="open" v-bind="config" />
</template>
```

### :star: Show Your Support

If SVAR Vue Excel Import helps your project, [give us a star](https://github.com/svar-widgets/vue-excel-import/)! It helps us reach more developers and keeps us motivated to add new features.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/vue-excel-import/issues/) or use our [community forum](https://forum.svar.dev).
