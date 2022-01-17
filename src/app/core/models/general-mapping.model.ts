import { AdvancedSettingGeneralMapping } from "./advanced-setting.model";
import { ExportSettingGeneralMapping } from "./export-setting.model";
import { ImportSettingGeneralMapping } from "./import-setting.model";

export type DefaultDestinationAttribute = {
  id: number;
  name: string;
}

export interface GeneralMapping extends ExportSettingGeneralMapping, ImportSettingGeneralMapping, AdvancedSettingGeneralMapping {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
