import { EmployeeSettingGet } from "src/app/core/models/configuration/employee-setting.model";
import { ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { EmployeeFieldMapping, AutoMapEmployee, ExpenseState, ExportDateType, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, CCCExpenseState, NameInJournalEntry } from "src/app/core/models/enum/enum.model";

export const response: EmployeeSettingGet = {
  workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
  workspace_id: 1
};
export const response1: ExportSettingGet = {
  expense_group_settings: {
    expense_state: ExpenseState.PAID,
    ccc_expense_state: CCCExpenseState.PAID,
    reimbursable_expense_group_fields: ['sample'],
    reimbursable_export_date_type: ExportDateType.APPROVED_AT,
    corporate_credit_card_expense_group_fields: ['sipper'],
    ccc_export_date_type: ExportDateType.SPENT_AT
  },
  workspace_general_settings: {
    reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL,
    name_in_journal_entry: NameInJournalEntry.EMPLOYEE,
    is_simplify_report_closure_enabled: true
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

export const response2: DestinationAttribute[] = [{
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