import { CorporateCreditCardExpensesObject, ExpenseState, ReimbursableExpensesObject, ReimbursableExportDateType } from "./enum.model";
import { DefaultDestinationAttribute } from "./general-mapping.model";

export type ExportSetting = {
  expense_group_settings: {
    expense_state: ExpenseState,
    reimbursable_expense_group_fields: string[],
    reimbursable_export_date_type: ReimbursableExportDateType,
    import_card_credits: boolean
  },
  workspace_general_settings: {
    reimbursable_expenses_object: ReimbursableExpensesObject,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject,
    map_merchant_to_vendor: boolean
  },
  general_mappings: {
    bank_account: DefaultDestinationAttribute,
    default_ccc_account: DefaultDestinationAttribute,
    accounts_payable: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute,
    qbo_expense_account: DefaultDestinationAttribute
  }
}

export class ExportSettingModel {
  static constructPayload() {
    return {};
  }
}
