import { AdvancedSettingWorkspaceGeneralSetting } from "./advanced-setting.model";
import { EmployeeSettingWorkspaceGeneralSetting } from "./employee-setting.model";
import { ExportSettingWorkspaceGeneralSetting } from "./export-setting.model";
import { ImportSettingWorkspaceGeneralSetting } from "./import-setting.model";

export interface WorkspaceGeneralSetting extends EmployeeSettingWorkspaceGeneralSetting, ExportSettingWorkspaceGeneralSetting, ImportSettingWorkspaceGeneralSetting, AdvancedSettingWorkspaceGeneralSetting {
  id: number;
  import_projects: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
