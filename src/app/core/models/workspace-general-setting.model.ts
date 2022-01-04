import { EmployeeFieldMapping } from "./enum.model"
import { ExportSettingWorkspaceGeneralSetting } from "./export-setting.model";
import { ImportSettingWorkspaceGeneralSetting } from "./import-setting.model";

export interface WorkspaceGeneralSetting extends ExportSettingWorkspaceGeneralSetting, ImportSettingWorkspaceGeneralSetting {
  id: number;
  import_projects: boolean;
  change_accounting_period: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_map_employees: string;
  auto_create_destination_entity: boolean;
  employee_field_mapping: EmployeeFieldMapping;
  je_single_credit_line: boolean;
  memo_structure: string[];
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
