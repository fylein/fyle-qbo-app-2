import { ExportSettingFormOption, ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { GroupedDestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { AutoMapEmployee, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseState, ExportDateType, ReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";

export const export_settings: ExportSettingFormOption[] = [
  {
    label: 'Check',
    value: ReimbursableExpensesObject.CHECK
  },
  {
    label: 'Expense',
    value: ReimbursableExpensesObject.EXPENSE
  },
  {
    label: 'Journal Entry',
    value: ReimbursableExpensesObject.JOURNAL_ENTRY
  }
];

export const workspaceResponse:WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  auto_create_merchants_as_vendors: true,
  auto_map_employees: AutoMapEmployee.EMAIL,
  category_sync_version: "v1",
  change_accounting_period: true,
  charts_of_accounts: ['Expense'],
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.JOURNAL_ENTRY,
  created_at: new Date("2022-04-27T11:07:17.694377Z"),
  employee_field_mapping: EmployeeFieldMapping.VENDOR,
  id: 1,
  import_categories: false,
  import_projects: false,
  import_tax_codes: false,
  import_vendors_as_merchants: false,
  je_single_credit_line: true,
  map_fyle_cards_qbo_account: true,
  map_merchant_to_vendor: false,
  memo_structure: ['Fyle'],
  reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
  skip_cards_mapping: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1
};
export const destinationAttribute: GroupedDestinationAttribute ={
  ACCOUNTS_PAYABLE: [{
    id: 1,
    attribute_type: 'ACCOUNTS_PAYABLE',
    display_name: "string",
    value: "string",
    destination_id: "string",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String',
      fully_qualified_name: 'string'
    }
  }],
  VENDOR: [{
    id: 2,
    attribute_type: 'VENDOR',
    display_name: "string",
    value: "string",
    destination_id: "string",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String',
      fully_qualified_name: 'string'
    }
  }],
  BANK_ACCOUNT: [{
    id: 3,
    attribute_type: 'BANK_ACCOUNT',
    display_name: "string",
    value: "string",
    destination_id: "string",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String',
      fully_qualified_name: 'string'
    }
  }],
  CREDIT_CARD_ACCOUNT: [{
    id: 4,
    attribute_type: 'CREDIT_CARD_ACCOUNT',
    display_name: "string",
    value: "string",
    destination_id: "string",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String',
      fully_qualified_name: 'string'
    }
  }],
  ACCOUNT: [],
  TAX_CODE: []
};
export const exportResponse: ExportSettingGet = {
  expense_group_settings: {
    expense_state: ExpenseState.PAID,
    reimbursable_expense_group_fields: ['sample'],
    reimbursable_export_date_type: ExportDateType.APPROVED_AT,
    corporate_credit_card_expense_group_fields: ['sipper'],
    ccc_export_date_type: ExportDateType.SPENT_AT
  },
  workspace_general_settings: {
    reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL
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
export const replacecontent1 = `You have changed the export type of reimbursable expense from <b>Check</b> to <b>Bill</b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const replacecontent2 = `You have changed the export type of reimbursable expense from <b></b> to <b></b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const replacecontent3 = `You have changed the export type of credit card expense from <b>CREDIT CARD PURCHASE</b> to <b>Bill</b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};
