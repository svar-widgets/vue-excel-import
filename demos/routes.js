import BasicInit from "./cases/BasicInit.vue";
import Locales from "./cases/Locales.vue";
import MandatoryFields from "./cases/MandatoryFields.vue";

export const links = [
	{
		group: "",
		items: [
			["/base/:skin", "Basic Excel Import", BasicInit, { file: "BasicInit" }],
		],
	},
	{
		group: "Configuration",
		items: [
			["/locales/:skin", "Locales", Locales, { file: "Locales" }],
			["/mandatory/:skin", "Mandatory fields", MandatoryFields, { file: "MandatoryFields" }],
		],
	},
];
