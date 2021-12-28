export type WorkspaceGeneralSettings = {
  id?: number;
  reimbursable_expenses_object: string;
  corporate_credit_card_expenses_object: string;
  import_projects?: boolean;
  import_categories: boolean;
  import_tax_codes: boolean;
  change_accounting_period: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_map_employees: string;
  auto_create_destination_entity: boolean;
  employee_field_mapping: string;
  je_single_credit_line: boolean;
  charts_of_accounts: string[];
  memo_structure?: string[];
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
}
