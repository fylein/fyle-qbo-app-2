import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeMapping } from "src/app/core/models/db/employee-mapping.model";
import { ExpenseAttribute } from "src/app/core/models/db/expense-attribute.model";
import { ExpenseGroup } from "src/app/core/models/db/expense-group.model";
import { MappingList, ResolveMappingError } from "src/app/core/models/db/mapping.model";
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
