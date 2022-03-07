import { AdvancedSettingWorkspaceGeneralSetting } from "../configuration/advanced-setting.model";
import { EmployeeSettingWorkspaceGeneralSetting } from "../configuration/employee-setting.model";
import { ExportSettingWorkspaceGeneralSetting } from "../configuration/export-setting.model";
import { ImportSettingWorkspaceGeneralSetting } from "../configuration/import-setting.model";

export interface WorkspaceGeneralSetting extends EmployeeSettingWorkspaceGeneralSetting, ExportSettingWorkspaceGeneralSetting, ImportSettingWorkspaceGeneralSetting, AdvancedSettingWorkspaceGeneralSetting {
  id: number;
  import_projects: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
