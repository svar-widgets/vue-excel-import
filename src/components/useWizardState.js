import { reactive, computed, provide, inject } from "vue";
import { transformData, autoDetectMappings } from "@svar-ui/excel-import-store";

const CONTEXT_KEY = Symbol("excel-import-state");

export class WizardContext {
  constructor(config) {
    this._config = { autoDetection: true, headerRow: true, ...config };

    const state = reactive({
      stage: "upload",
      file: null,
      parsedData: null,
      activeSheet: "",
      sheetMappings: {},
      processingProgress: 0,
      error: null,
      autoDetections: [],
      importResult: null,
    });
    this._state = state;

    this._currentSheet = computed(() => {
      if (!state.parsedData) return null;
      return (
        state.parsedData.sheets.find((s) => s.name === state.activeSheet) ??
        null
      );
    });

    this._currentMappings = computed(() => {
      return (
        state.sheetMappings[state.activeSheet] ?? this.createEmptyMappings()
      );
    });

    this._validationResult = computed(() => {
      const sheet = this._currentSheet.value;
      if (!sheet) {
        return { valid: false, errors: [], warnings: [] };
      }
      if (!this._config.validate) {
        return { valid: true, errors: [], warnings: [] };
      }
      return this._config.validate(this._currentMappings.value, sheet);
    });

    this._mappedColumns = computed(() => {
      const cols = new Set();
      for (const columnId of Object.values(this._currentMappings.value)) {
        if (columnId) cols.add(columnId);
      }
      return cols;
    });

    // Handle initial data if provided
    if (config.data) {
      state.stage = "mapping";
      state.parsedData = config.data;
      state.activeSheet = config.data.sheets[0]?.name ?? "";

      for (const sheet of config.data.sheets) {
        state.sheetMappings[sheet.name] = this.createEmptyMappings();
      }

      if (config.autoDetection) {
        const sheet = config.data.sheets[0];
        if (sheet) {
          state.autoDetections = autoDetectMappings(
            sheet.columns,
            config.fields,
          );
          for (const detection of state.autoDetections) {
            state.sheetMappings[sheet.name][detection.fieldId] =
              detection.columnId;
          }
        }
      }
    }
  }

  get config() {
    return this._config;
  }

  get stage() {
    return this._state.stage;
  }
  set stage(v) {
    this._state.stage = v;
  }

  get file() {
    return this._state.file;
  }
  set file(v) {
    this._state.file = v;
  }

  get parsedData() {
    return this._state.parsedData;
  }
  set parsedData(v) {
    this._state.parsedData = v;
  }

  get activeSheet() {
    return this._state.activeSheet;
  }
  set activeSheet(v) {
    this._state.activeSheet = v;
  }

  get sheetMappings() {
    return this._state.sheetMappings;
  }
  set sheetMappings(v) {
    this._state.sheetMappings = v;
  }

  get processingProgress() {
    return this._state.processingProgress;
  }
  set processingProgress(v) {
    this._state.processingProgress = v;
  }

  get error() {
    return this._state.error;
  }
  set error(v) {
    this._state.error = v;
  }

  get autoDetections() {
    return this._state.autoDetections;
  }
  set autoDetections(v) {
    this._state.autoDetections = v;
  }

  get importResult() {
    return this._state.importResult;
  }
  set importResult(v) {
    this._state.importResult = v;
  }

  get currentSheet() {
    return this._currentSheet.value;
  }

  get currentMappings() {
    return this._currentMappings.value;
  }

  get validationResult() {
    return this._validationResult.value;
  }

  get mappedColumns() {
    return this._mappedColumns.value;
  }

  createEmptyMappings() {
    const mappings = {};
    for (const field of this._config.fields) {
      mappings[field.id] = null;
    }
    return mappings;
  }

  setFieldMapping(fieldId, columnId) {
    if (!this._state.sheetMappings[this._state.activeSheet]) {
      this._state.sheetMappings[this._state.activeSheet] =
        this.createEmptyMappings();
    }

    if (columnId) {
      for (const [fId, cId] of Object.entries(
        this._state.sheetMappings[this._state.activeSheet],
      )) {
        if (cId === columnId && fId !== fieldId) {
          this._state.sheetMappings[this._state.activeSheet][fId] = null;
        }
      }
    }

    this._state.sheetMappings[this._state.activeSheet][fieldId] = columnId;
  }

  clearAllMappings() {
    this._state.sheetMappings[this._state.activeSheet] =
      this.createEmptyMappings();
    this._state.autoDetections = [];
  }

  performImport() {
    if (!this.currentSheet || !this.validationResult.valid) return;

    const result = transformData(
      this.currentSheet,
      this.currentMappings,
      this._config.fields,
      this._config.generateIds,
    );

    this._state.importResult = result.importResult;
    this._config.onimport?.(result.data, result.importResult);

    if (this._config.autoClose) {
      this.close();
    } else {
      this._state.stage = "complete";
    }
  }

  reset() {
    this._state.stage = "upload";
    this._state.file = null;
    this._state.parsedData = null;
    this._state.activeSheet = "";
    this._state.sheetMappings = {};
    this._state.processingProgress = 0;
    this._state.error = null;
    this._state.autoDetections = [];
    this._state.importResult = null;
  }

  close() {
    this._config.onclose?.();
  }

  loadData(data) {
    this._state.parsedData = data;
    this._state.activeSheet = data.sheets[0]?.name ?? "";

    for (const sheet of data.sheets) {
      this._state.sheetMappings[sheet.name] = this.createEmptyMappings();
    }

    if (this._config.autoDetection && data.sheets[0]) {
      this._state.autoDetections = autoDetectMappings(
        data.sheets[0].columns,
        this._config.fields,
      );
      for (const detection of this._state.autoDetections) {
        this._state.sheetMappings[this._state.activeSheet][detection.fieldId] =
          detection.columnId;
      }
    }
  }

  selectSheet(sheetName) {
    if (this._state.activeSheet === sheetName) return;

    this._state.activeSheet = sheetName;

    if (!this._state.sheetMappings[sheetName]) {
      this._state.sheetMappings[sheetName] = this.createEmptyMappings();
    }

    const sheet = this._state.parsedData?.sheets.find(
      (s) => s.name === sheetName,
    );
    const hasAnyMapping = Object.values(
      this._state.sheetMappings[sheetName],
    ).some((v) => v !== null);

    if (this._config.autoDetection && sheet && !hasAnyMapping) {
      this._state.autoDetections = autoDetectMappings(
        sheet.columns,
        this._config.fields,
      );
      for (const detection of this._state.autoDetections) {
        this._state.sheetMappings[sheetName][detection.fieldId] =
          detection.columnId;
      }
    } else {
      this._state.autoDetections = [];
    }
  }
}

export function setWizardContext(context) {
  provide(CONTEXT_KEY, context);
}

export function getWizardContext() {
  const context = inject(CONTEXT_KEY);
  if (!context) {
    throw new Error(
      "Wizard context not found. Make sure this component is inside ExcelImport.",
    );
  }
  return context;
}
