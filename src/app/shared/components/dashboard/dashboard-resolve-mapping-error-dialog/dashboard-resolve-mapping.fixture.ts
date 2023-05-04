import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { ExpenseAttribute } from "src/app/core/models/db/expense-attribute.model";
import { ExpenseGroup } from "src/app/core/models/db/expense-group.model";
import { MappingList, ResolveMappingError } from "src/app/core/models/db/mapping.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { FyleReferenceType, EmployeeFieldMapping, ErrorType, MappingState, QBOField } from "src/app/core/models/enum/enum.model";

export   const expenseAttribute: ExpenseAttribute = {
  id: 1,
  attribute_type: 'string',
  display_name: 'string',
  value: 'string',
  source_id: 1,
  auto_mapped: true,
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  detail: {
    location: 'string',
    full_name: 'string',
    department_id: 'string',
    department: 'string',
    department_code: 'string',
    employee_code: 'string'
  }
};
export const expencegroup:ExpenseGroup = {
  id: 1,
  fund_source: 'dummy',
  description: {
    claim_number: FyleReferenceType.EXPENSE_REPORT,
    report_id: FyleReferenceType.EXPENSE_REPORT,
    employee_email: 'employee@gmail.com',
    expense_id: FyleReferenceType.EXPENSE,
    settlement_id: FyleReferenceType.PAYMENT
  },
  response_logs: [],
  export_type: 'Expence',
  employee_name: 'Fyle',
  exported_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  expenses: []
};
export const model: ResolveMappingError = {
  sourceType: EmployeeFieldMapping.EMPLOYEE,
  destinationType: EmployeeFieldMapping.VENDOR,
  fyleAttributes: [{
    id: 1,
    type: ErrorType.CATEGORY_MAPPING,
    expense_group: expencegroup,
    expense_attribute: expenseAttribute,
    is_resolved: true,
    error_title: 'string',
    error_detail: 'string',
    workspace_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }],
  workspaceId: "string"
};

export const model2: ResolveMappingError = {
  sourceType: EmployeeFieldMapping.VENDOR,
  destinationType: QBOField.ACCOUNT,
  fyleAttributes: [{
    id: 1,
    type: ErrorType.CATEGORY_MAPPING,
    expense_group: expencegroup,
    expense_attribute: expenseAttribute,
    is_resolved: true,
    error_title: 'string',
    error_detail: 'string',
    workspace_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }],
  workspaceId: "string"
};
export const mappinglist: MappingList[] = [{
  fyle: {
      id: 1,
      value: 'string'
  },
  qbo: {
      id: 'string',
      value: 'string'
  },
  preserveDestination: {
      id: 'string'
  },
  autoMapped: true,
  state: MappingState.ALL,
  index: 1
}];
export const destinationAttributes: DestinationAttribute = {
  id: 1,
  attribute_type: 'VENDOR',
  display_name: 'Vendor',
  value: 'dummy',
  destination_id: '1',
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'dummy@gmail.com',
    fully_qualified_name: 'Fyle'
  }
};
export const response: EmployeeMapping = {
  id: 1,
  source_employee: {
    id: 1,
    attribute_type: 'VENDOR',
    display_name: 'Vendor',
    value: 'dummy',
    source_id: 1,
    auto_mapped: true,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      location: 'india',
      full_name: 'Fyle Integrations',
      department_id: '2',
      department: 'Integrations',
      department_code: 'FYI2',
      employee_code: 'FYIE1'
    }
  },
  destination_employee: destinationAttributes,
  destination_vendor: destinationAttributes,
  destination_card_account: destinationAttributes,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2
};

export const getWorkspaceGeneralSettingsResponse: WorkspaceGeneralSetting = {
  id: 1,
  import_projects: true,
  created_at: new Date("2022-06-14T06:24:56.947727Z"),
  updated_at: new Date("2022-06-14T06:24:56.947727Z"),
  workspace: 1,
  employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  auto_map_employees: null,
  reimbursable_expenses_object: null,
  corporate_credit_card_expenses_object: null,
  import_categories: true,
  import_items: true,
  import_vendors_as_merchants: false,
  charts_of_accounts: ['Expense'],
  import_tax_codes: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  auto_create_destination_entity: false,
  auto_create_merchants_as_vendors: false,
  je_single_credit_line: false,
  change_accounting_period: false,
  memo_structure: ['employee_email', 'category', 'spent_on', 'report_number', 'purpose', 'expense_link'],
  category_sync_version: 'v2',
  map_fyle_cards_qbo_account: false,
  map_merchant_to_vendor: false,
  skip_cards_mapping: false,
  is_simplify_report_closure_enabled: false
};
