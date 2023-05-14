import { WorkspaceGeneralSetting } from "../../../core/models/db/workspace-general-setting.model";
import { EmployeeFieldMapping, ErrorType, ExpenseState, CCCExpenseState, ExportDateType, ExportMode, TaskLogState, TaskLogType } from "../../../core/models/enum/enum.model";
import { ExpenseGroupSetting } from '../../../core/models/db/expense-group-setting.model';
import { MinimalUser } from "src/app/core/models/db/user.model";
import { LastExport } from "src/app/core/models/db/last-export.model";
import { environment } from "src/environments/environment";
import { ExportableExpenseGroup } from "src/app/core/models/db/expense-group.model";

const API_BASE_URL = environment.api_url;
const workspace_id = environment.tests.workspaceId;

export const workspaceGeneralSettingResponse:WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  is_simplify_report_closure_enabled: true,
  auto_create_merchants_as_vendors: true,
  auto_map_employees: null,
  category_sync_version: "v1",
  change_accounting_period: true,
  charts_of_accounts: ['Expense'],
  corporate_credit_card_expenses_object: null,
  created_at: new Date("2022-04-27T11:07:17.694377Z"),
  employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  id: 1,
  import_categories: false,
  import_items: false,
  import_projects: false,
  import_tax_codes: false,
  import_vendors_as_merchants: false,
  je_single_credit_line: true,
  map_fyle_cards_qbo_account: true,
  map_merchant_to_vendor: false,
  memo_structure: ['Fyle'],
  reimbursable_expenses_object: null,
  skip_cards_mapping: false,
  sync_fyle_to_qbo_payments: false,
  sync_qbo_to_fyle_payments: false,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1
};
export const expenseGroupSettingResponse:ExpenseGroupSetting = {
  ccc_export_date_type: ExportDateType.CURRENT_DATE,
  corporate_credit_card_expense_group_fields: ["employee_email", "report_id", "expense_id", "fund_source"],
  created_at: new Date("2022-04-13T10:29:18.802702Z"),
  expense_state: ExpenseState.PAYMENT_PROCESSING,
  ccc_expense_state: CCCExpenseState.PAYMENT_PROCESSING,
  id: 1,
  import_card_credits: false,
  reimbursable_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
  reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
  updated_at: new Date("2022-04-13T10:29:18.802749Z"),
  workspace: 1
};
export const expenseGroupSettingResponse1 = {
  ccc_export_date_type: ExportDateType.CURRENT_DATE,
  corporate_credit_card_expense_group_fields: ["employee_email", "report_id", "expense_id", "fund_source"],
  created_at: new Date("2022-04-13T10:29:18.802702Z"),
  expense_state: ExpenseState.PAYMENT_PROCESSING,
  ccc_expense_state: CCCExpenseState.PAYMENT_PROCESSING,
  id: 1,
  import_card_credits: false,
  reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
  updated_at: new Date("2022-04-13T10:29:18.802749Z"),
  workspace: 1
};
export const user:MinimalUser = {
  access_token: "fyle",
  email: "sravan.kumar@fyle.in",
  full_name: "sravan k",
  org_id: "orunxXsIajSE",
  org_name: "Test Sample Statement - GBP",
  refresh_token: "fyle",
  user_id: "ust5Ga9HC3qc"
};

export const getExportErrorsData = [{
  id: 1,
  type: ErrorType.CATEGORY_MAPPING,
  expense_group: {
    id: 1,
    fund_source: 'Credit Card',
    description: {"report_id": "rp3YxnytLrgS", "claim_number": "C/2022/05/R/11", "employee_email": "sravan.kumar@fyle.in", "settlement_id": "ss", "expense_id": '1'},
    response_logs: [],
    export_type: 'Fyle',
    employee_name: 'Aswin',
    exported_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 1,
    expenses: [
      {
        amount: 1,
        approved_at: new Date(),
        category: 'string',
        claim_number: 'string',
        cost_center: 'string',
        created_at: new Date(),
        currency: 'string',
        employee_email: 'string',
        expense_created_at: new Date(),
        expense_id: 'string',
        expense_number: 'string',
        expense_updated_at: new Date(),
        exported: true,
        foreign_amount: 1,
        foreign_currency: 'string',
        fund_source: 'string',
        org_id: 'string',
        id: 1,
        project: 'string',
        purpose: 'string',
        reimbursable: true,
        report_id: 'string',
        settlement_id: 'string',
        payment_number: 'string',
        spent_at: new Date(),
        state: 'string',
        sub_category: 'string',
        updated_at: new Date(),
        vendor: 'string',
        billable: true,
        verified_at: new Date(),
        paid_on_qbo: true,
        custom_properties: []
      }
    ]
  },
  expense_attribute: {
    id: 1,
    attribute_type: "string",
    display_name: "string",
    value: "string",
    source_id: 1,
    auto_mapped: true,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 1,
    detail: {
      location: "string",
      full_name: "string",
      department_id: "string",
      department: "string",
      department_code: "string",
      employee_code: "string"
    }
  },
  is_resolved: true,
  error_title: "string",
  error_detail: "string",
  workspace_id: 1,
  created_at: new Date(),
  updated_at: new Date()
}];
export const getLastExportResponse:LastExport={
  created_at: new Date("2022-04-27T06:37:30.296865Z"),
  export_mode: ExportMode.MANUAL,
  failed_expense_groups_count: 5,
  id: 154,
  last_exported_at: new Date("2022-05-10T08:00:38.440819Z"),
  successful_expense_groups_count: 0,
  total_expense_groups_count: 5,
  updated_at: new Date("2022-05-10T08:00:43.857641Z"),
  workspace: +workspace_id
};
const task = [{
  bill: 1,
  cheque: 1,
  created_at: new Date(),
  credit_card_purchase: 1,
  detail: "any",
  quickbooks_errors: [],
  expense_group: 1,
  id: 1,
  journal_entry: 1,
  bill_payment: 1,
  status: TaskLogState.ENQUEUED,
  task_id: "string",
  type: TaskLogType.CREATING_BILL,
  updated_at: new Date(),
  workspace: workspace_id
}];
export const allTasksResponse = {
  count: 3,
  next: null,
  previous: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500`,
  results: task
};
export const getExportableGroupsIdsResponse:ExportableExpenseGroup = {exportable_expense_group_ids: [1, 2, 4]};
export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};