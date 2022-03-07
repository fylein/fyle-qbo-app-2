import { AdvancedSettingGeneralMapping } from "../configuration/advanced-setting.model";
import { ExportSettingGeneralMapping } from "../configuration/export-setting.model";
import { ImportSettingGeneralMapping } from "../configuration/import-setting.model";

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
