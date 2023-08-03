import { EmployeeFieldMapping, AutoMapEmployee, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, FyleField } from "../enum/enum.model";

export type WorkspaceGeneralSetting = {
  id: number;
  import_projects: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  employee_field_mapping: EmployeeFieldMapping;
  auto_map_employees: AutoMapEmployee | null;
  reimbursable_expenses_object: ReimbursableExpensesObject | null;
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject | null;
  import_categories: boolean;
  import_items: boolean;
  import_vendors_as_merchants: boolean;
  charts_of_accounts: string[];
  import_tax_codes: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_create_destination_entity: boolean;
  auto_create_merchants_as_vendors: boolean,
  je_single_credit_line: boolean;
  change_accounting_period: boolean;
  memo_structure: string[];
  category_sync_version?: string;
  map_fyle_cards_qbo_account?: boolean;
  map_merchant_to_vendor?: boolean;
  skip_cards_mapping?: boolean;
  name_in_journal_entry: FyleField;
  is_simplify_report_closure_enabled: boolean;
};
