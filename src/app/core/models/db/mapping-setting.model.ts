import { ImportSettingMappingSetting } from "../configuration/import-setting.model";

export interface MappingSetting extends ImportSettingMappingSetting {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
