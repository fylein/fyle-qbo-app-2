import { CorporateCreditCardExpensesObject, ExpenseState, ReimbursableExpensesObject, ReimbursableExportDateType } from "./enum.model";
import { ExpenseGroupSetting, ExpenseGroupSettingPost } from "./expense-group-setting.model";
import { DefaultDestinationAttribute, GeneralMapping } from "./general-mapping.model";
import { SelectFormOption } from "./select-form-option.model";
import { WorkspaceGeneralSetting } from "./workspace-general-setting.model";

export type ExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: ExportSettingWorkspace,
  general_mappings: ExportSettingGeneralMapping[]
}

export type ExportSettingWorkspace = {
  reimbursable_expenses_object: ReimbursableExpensesObject,
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject,
  map_merchant_to_vendor: boolean
}

export type ExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute,
  default_ccc_account: DefaultDestinationAttribute,
  accounts_payable: DefaultDestinationAttribute,
  default_ccc_vendor: DefaultDestinationAttribute,
  qbo_expense_account: DefaultDestinationAttribute
}

export type ExportSettingGet = {
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
