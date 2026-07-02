import { DefineComponent } from "vue";
import {
	type ImportWizardConfig,
	type ParsedExcelData,
	type ParsedSheetData,
	type FieldMappings,
	type ValidationResult,
	type AutoDetection,
	type ImportResult,
	type WizardStage,
} from "@svar-ui/excel-import-store";

export declare class WizardContext {
	config: ImportWizardConfig;
	stage: WizardStage;
	file: File | null;
	parsedData: ParsedExcelData | null;
	activeSheet: string;
	sheetMappings: Record<string, FieldMappings>;
	processingProgress: number;
	error: string | null;
	autoDetections: AutoDetection[];
	importResult: ImportResult | null;
	readonly currentSheet: ParsedSheetData | null;
	readonly currentMappings: FieldMappings;
	readonly validationResult: ValidationResult;
	readonly mappedColumns: Set<string>;
	constructor(config: ImportWizardConfig);
	createEmptyMappings(): FieldMappings;
	setFieldMapping(fieldId: string, columnId: string | null): void;
	clearAllMappings(): void;
	performImport(): void;
	reset(): void;
	close(): void;
	loadData(data: ParsedExcelData): void;
	selectSheet(sheetName: string): void;
}

export declare function setWizardContext(context: WizardContext): void;

export declare const EXCEL_IMPORT_STATE_CONTEXT: symbol;

export declare const ExcelImport: DefineComponent<ImportWizardConfig>;

export declare const StageUpload: DefineComponent<{}>;
export declare const StageProcessing: DefineComponent<{}>;
export declare const StageMapping: DefineComponent<{}>;
export declare const StageComplete: DefineComponent<{}>;

export declare const Willow: DefineComponent<{ fonts?: boolean }>;
export declare const WillowDark: DefineComponent<{ fonts?: boolean }>;

export declare const version: string;
