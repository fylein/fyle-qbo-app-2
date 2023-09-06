import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingPost } from "src/app/core/models/configuration/advanced-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from "src/app/core/models/db/workspace-schedule.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { AutoMapEmployee, CorporateCreditCardExpensesObject, CustomOperatorOption, EmployeeFieldMapping, JoinOption, Operator, PaymentSyncDirection, ReimbursableExpensesObject, NameInJournalEntry } from "src/app/core/models/enum/enum.model";
import { ConditionField, ExpenseFilterResponse, SkipExport } from "src/app/core/models/misc/skip-export.model";

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
  import_items: false,
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
  workspace: 1,
  name_in_journal_entry: NameInJournalEntry.EMPLOYEE
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
export const paymentSyncOptions = [
  {
    label: 'None',
    value: null
  },
  {
    label: 'Export Fyle ACH Payments to Quickbooks Online',
    value: PaymentSyncDirection.FYLE_TO_QBO
  },
  {
    label: 'Import Quickbooks Payments into Fyle',
    value: PaymentSyncDirection.QBO_TO_FYLE
  }
];
export const getadvancedSettingResponse2:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_qbo_payments: true,
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

export const postExpenseFilterResponse: SkipExport = {
  condition: 'employee_email',
  custom_field_type: null,
  operator: Operator.IExact,
  values: ['anish@email.com', 'ashwin@fyle.in'],
  rank: 1,
  join_by: null,
  is_custom: false
};

export const getExpenseFilterResponse: ExpenseFilterResponse = {
  count: 1,
  results: [
    {
      condition: 'employee_email',
      custom_field_type: null,
      operator: Operator.IExact,
      values: ['anish@email.com', 'ashwin@fyle.in'],
      rank: 1,
      is_custom: false,
      join_by: null
    }
  ]
};

export const getExpenseFilterResponse2: ExpenseFilterResponse = {
  count: 1,
  results: [
    {
      condition: 'employee_email',
      custom_field_type: null,
      operator: Operator.IsNull,
      values: ['anish@email.com', 'ashwin@fyle.in'],
      rank: 1,
      is_custom: false,
      join_by: JoinOption.AND
    },
    {
      condition: 'claim_number',
      custom_field_type: null,
      operator: Operator.IExact,
      values: ['1234', '5678'],
      rank: 2,
      is_custom: false,
      join_by: null
    }
  ]
};

export const getExpenseFilterResponse3: ExpenseFilterResponse = {
  count: 1,
  results: [
    {
      condition: 'Custom Expense Field',
      custom_field_type: 'TEXT',
      operator: Operator.IExact,
      values: [],
      rank: 1,
      is_custom: true,
      join_by: JoinOption.AND
    },
    {
      condition: 'claim_number',
      custom_field_type: null,
      operator: Operator.IsNull,
      values: ['1234', '5678'],
      rank: 2,
      is_custom: true,
      join_by: JoinOption.AND
    }
  ]
};

export const getExpenseFilterResponse4: ExpenseFilterResponse = {
  count: 2,
  results: [
    {
      condition: 'Custom Expense Field',
      custom_field_type: 'TEXT',
      operator: Operator.IsNull,
      values: [],
      rank: 1,
      is_custom: true,
      join_by: JoinOption.AND
    },
    {
      condition: 'claim_number',
      custom_field_type: null,
      operator: Operator.IExact,
      values: ['opooj'],
      rank: 2,
      is_custom: true,
      join_by: JoinOption.AND
    }
  ]
};

export const conditionFieldOptions: ConditionField[] = [
  { field_name: 'employee_email', type: 'SELECT', is_custom: false},
  { field_name: 'report_title', type: 'TEXT', is_custom: false},
  { field_name: 'Custom Expense Field', type: 'TEXT', is_custom: false},
  { field_name: 'claim_number', type: 'SELECT', is_custom: false}
];

export const adminEmails: WorkspaceScheduleEmailOptions[] = [ {name: 'fyle', email: 'fyle@fyle.in'}, {name: 'fyle2', email: 'fyle2@fyle.in'}];
export const memo = ['employee_email', 'merchant', 'purpose', 'category', 'report_number', 'expense_link'];
export const customFields = ['Team', 'User Dimension', 'Operating Systems', 'User Dimension 2'];

export const conditionMock1: ConditionField = {
  field_name: 'employee_email',
  type: 'SELECT',
  is_custom: false
};

export const conditionMock2: ConditionField = {
  field_name: 'report_title',
  type: 'TEXT',
  is_custom: false
};

export const conditionMock3: ConditionField = {
  field_name: 'spent_at',
  type: 'DATE',
  is_custom: false
};

export const conditionMock4: ConditionField = {
  field_name: 'Custom Expense Field',
  type: 'SELECT',
  is_custom: true
};

export const customOperatorMock1 = {
  label: 'Is',
  value: CustomOperatorOption.Is
};

export const customOperatorMock2 = {
  label: 'IsEmpty',
  value: CustomOperatorOption.IsEmpty
};

export const customOperatorMock3 = {
  label: 'Is',
  value: CustomOperatorOption.Is
};

export const customOperatorMock4 = {
  label: 'Is not',
  value: 'not_in'
};

export const claimNumberOperators = [{
  value: 'iexact',
  label: 'Is'
}];

export const spentAtOperators = [{
  value: 'lt',
  label: 'Is before'
}, {
  value: 'lte',
  label: 'Is it on or before'
}];

export const reportTitleOperators = [{
  value: 'iexact',
  label: 'Is'
}, {
  value: 'icontains',
  label: 'contains'
}];