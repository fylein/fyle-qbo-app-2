import { FormGroup } from "@angular/forms";
import { CorporateCreditCardExpensesObject, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, ReimbursableExpensesObject } from "../enum/enum.model";
import { ExpenseGroupSetting, ExpenseGroupSettingPost } from "../db/expense-group-setting.model";
import { DefaultDestinationAttribute, GeneralMapping } from "../db/general-mapping.model";
import { SelectFormOption } from "../misc/select-form-option.model";

export type ExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: ExportSettingWorkspaceGeneralSetting,
  general_mappings: ExportSettingGeneralMapping
}

export type ExportSettingWorkspaceGeneralSetting = {
  reimbursable_expenses_object: ReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject | null
}

export type ExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute,
  default_ccc_account: DefaultDestinationAttribute,
  accounts_payable: DefaultDestinationAttribute,
  default_ccc_vendor: DefaultDestinationAttribute,
  qbo_expense_account: DefaultDestinationAttribute,
  default_debit_card_account: DefaultDestinationAttribute
}

export type ExportSettingGet = {
  expense_group_settings: ExpenseGroupSetting,
  workspace_general_settings: ExportSettingWorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  workspace_id:number
}

export interface ExportSettingFormOption extends SelectFormOption {
  value: ExpenseState | ReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExpenseGroupingFieldOption | ExportDateType;
}

export class ExportSettingModel {
  static constructPayload(exportSettingsForm: FormGroup): ExportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        expense_state: exportSettingsForm.get('expenseState')?.value,
        reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
        corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
        ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : emptyDestinationAttribute,
        default_ccc_account: exportSettingsForm.get('defaultCCCAccount')?.value ? exportSettingsForm.get('defaultCCCAccount')?.value : emptyDestinationAttribute,
        accounts_payable: exportSettingsForm.get('accountsPayable')?.value ? exportSettingsForm.get('accountsPayable')?.value : emptyDestinationAttribute,
        default_ccc_vendor: exportSettingsForm.get('defaultCreditCardVendor')?.value ? exportSettingsForm.get('defaultCreditCardVendor')?.value : emptyDestinationAttribute,
        qbo_expense_account: exportSettingsForm.get('qboExpenseAccount')?.value ? exportSettingsForm.get('qboExpenseAccount')?.value : emptyDestinationAttribute,
        default_debit_card_account: exportSettingsForm.get('defaultDebitCardAccount')?.value ? exportSettingsForm.get('defaultDebitCardAccount')?.value : emptyDestinationAttribute
      }
    };
    return exportSettingPayload;
  }
}
