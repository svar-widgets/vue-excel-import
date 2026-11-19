import { createApp } from "vue";
import ExcelImport from "./components/Export.vue";

function init(target, config, skin) {
  const app = createApp(ExcelImport, {
    config,
    skin,
  });
  app.mount(target ? document.querySelector(target) : document.body);
}

export { init };
