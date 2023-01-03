import { AdvancedSettingGet, AdvancedSettingPost } from "src/app/core/models/configuration/advanced-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from "src/app/core/models/db/workspace-schedule.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { AutoMapEmployee, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";

export const response:WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  is_simplify_report_closure_enabled: true,
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
  auto_create_merchants_as_vendors: true,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1
};

export const advancedSettingResponse:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_qbo_payments: false,
    sync_qbo_to_fyle_payments: false,
    auto_create_destination_entity: true,
    auto_create_merchants_as_vendors: true,
    je_single_credit_line: true,
    change_accounting_period: true,
    memo_structure: ['Fyle']
  },
  general_mappings: {
    bill_payment_account: { id: '1', name: 'Fyle' }
  },
  workspace_schedules: {
    enabled: true,
    interval_hours: 10,
    emails_selected: [],
    additional_email_options: []
  },
  workspace_id: 1
};
export const destinationAttribute: DestinationAttribute[] = [{
  id: 1,
  attribute_type: 'EMPLOYEE',
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
},
{
  id: 1,
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
}];
export const getadvancedSettingResponse:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_qbo_payments: false,
    sync_qbo_to_fyle_payments: true,
    auto_create_destination_entity: true,
    auto_create_merchants_as_vendors: true,
    je_single_credit_line: true,
    change_accounting_period: true,
    memo_structure: ['Fyle']
  },
  general_mappings: {
    bill_payment_account: { id: '1', name: 'Fyle' }
  },
  workspace_schedules: {
    enabled: true,
    interval_hours: 10,
    emails_selected: [],
    additional_email_options: []
  },
  workspace_id: 1
};

export const getadvancedSettingResponse2:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_qbo_payments: true,
    sync_qbo_to_fyle_payments: true,
    auto_create_destination_entity: true,
    auto_create_merchants_as_vendors: true,
    je_single_credit_line: true,
    change_accounting_period: true,
    memo_structure: ['Fyle']
  },
  general_mappings: {
    bill_payment_account: { id: '1', name: 'Fyle' }
  },
  workspace_schedules: {
    enabled: true,
    interval_hours: 10,
    emails_selected: [],
    additional_email_options: []
  },
  workspace_id: 1
};
export const previewResponse = 'john.doe@acme.com - Pizza Hut - Client Meeting - Meals and Entertainment - C/2021/12/R/1 - https://app.fylehq.com/app/main/#/enterprise/view_expense/';
export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};
export const emailResponse: WorkspaceSchedule = {
  id: 1,
  workspace: 1,
  enabled: false,
  start_datetime: new Date(),
  interval_hours: 1,
  schedule: 1,
  emails_selected: ['fyle@fyle.in', 'integrations@fyle.in' ],
  additional_email_options: [{name: 'fyle3', email: 'fyle3@fyle.in'}]
};
export const adminEmails: WorkspaceScheduleEmailOptions[] = [ {name: 'fyle', email: 'fyle@fyle.in'}, {name: 'fyle2', email: 'fyle2@fyle.in'}];
export const memo = ['employee_email', 'merchant', 'purpose', 'category', 'report_number', 'expense_link'];