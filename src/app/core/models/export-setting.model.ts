import { CorporateCreditCardExpensesObject, ExpenseState, ReimbursableExpensesObject, ReimbursableExportDateType } from "./enum.model";
import { ExpenseGroupSetting, ExpenseGroupSettingPost } from "./expense-group-setting.model";
import { GeneralMapping, GeneralMappingPost } from "./general-mapping.model";
import { SelectFormOption } from "./select-form-option.model";
import { WorkspaceGeneralSetting, WorkspaceGeneralSettingPost } from "./workspace-general-setting.model";

export type ExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: WorkspaceGeneralSettingPost,
  general_mappings: GeneralMappingPost[]
}

export type ExportSetting = {
  expense_group_settings: ExpenseGroupSetting,
  workspace_general_settings: WorkspaceGeneralSetting,
  general_mappings: GeneralMapping
}

export interface ExportSettingFormOption extends SelectFormOption {
  value: ExpenseState | ReimbursableExpensesObject | CorporateCreditCardExpensesObject;
}

export class ExportSettingModel {
  static constructPayload() {
    return {};
  }
}
