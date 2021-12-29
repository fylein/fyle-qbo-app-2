import { CorporateCreditCardExpensesObject, EmployeeFieldMapping, ReimbursableExpensesObject } from "./enum.model"

export interface WorkspaceGeneralSetting extends WorkspaceGeneralSettingPost {
  id: number;
  import_projects: boolean;
  import_categories: boolean;
  import_tax_codes: boolean;
  change_accounting_period: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_map_employees: string;
  auto_create_destination_entity: boolean;
  employee_field_mapping: EmployeeFieldMapping;
  je_single_credit_line: boolean;
  charts_of_accounts: string[];
  memo_structure: string[];
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export type WorkspaceGeneralSettingPost = {
  reimbursable_expenses_object: ReimbursableExpensesObject,
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject,
  map_merchant_to_vendor: boolean
}
