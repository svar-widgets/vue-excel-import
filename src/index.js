import pkg from "../package.json";
const version = pkg.version;

import ExcelImport from "./components/ExcelImport.vue";
import Willow from "./themes/Willow.vue";
import WillowDark from "./themes/WillowDark.vue";

export { EXCEL_IMPORT_STATE_CONTEXT } from "./context.js";

// code below is internals exposed for UI regression testing — not part of the stable public API.
export { default as StageUpload } from "./components/stages/StageUpload.vue";
export { default as StageProcessing } from "./components/stages/StageProcessing.vue";
export { default as StageMapping } from "./components/stages/StageMapping.vue";
export { default as StageComplete } from "./components/stages/StageComplete.vue";
export {
  WizardContext,
  setWizardContext,
} from "./components/useWizardState.js";

export { ExcelImport, Willow, WillowDark, version };
