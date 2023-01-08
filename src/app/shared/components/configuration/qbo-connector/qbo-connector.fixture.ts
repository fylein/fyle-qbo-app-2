import { ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { ExpenseState, CCCExpenseState, ExportDateType, ReimbursableExpensesObject, CorporateCreditCardExpensesObject } from "src/app/core/models/enum/enum.model";

export const response = {
  id: 1,
  refresh_token: 'fyle',
  is_expired: false,
  realm_id: 'realmId',
  country: 'india',
  company_name: 'Fyle',
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2
};

export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};

export const errorResponse2 = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO',
    message: 'Please choose the correct QuickBooks Online account'
  }
};

export const exportResponse: ExportSettingGet = {
  expense_group_settings: {
    expense_state: ExpenseState.PAID,
    ccc_expense_state: CCCExpenseState.PAID,
    reimbursable_expense_group_fields: ['sample'],
    reimbursable_export_date_type: ExportDateType.APPROVED_AT,
    corporate_credit_card_expense_group_fields: ['sipper'],
    ccc_export_date_type: ExportDateType.SPENT_AT
  },
  workspace_general_settings: {
    reimbursable_expenses_object: null,
    corporate_credit_card_expenses_object: null,
  },
  general_mappings: {
    bank_account: { id: '1', name: 'Fyle' },
    default_ccc_account: { id: '1', name: 'Fyle' },
    accounts_payable: { id: '1', name: 'Fyle' },
    default_ccc_vendor: { id: '1', name: 'Fyle' },
    qbo_expense_account: { id: '1', name: 'Fyle' },
    default_debit_card_account: { id: '1', name: 'Fyle' }
  },
  workspace_id: 1
};
