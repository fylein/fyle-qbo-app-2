export type ExpenseGroupResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
};

export interface ExpenseGroupList {
  exportedAt: Date;
  employee: [string, string];
  expenseType: 'Credit Card' | 'Reimbursable';
  referenceNumber: string;
  exportedAs: string;
  url: string;
}

export type ExpenseGroup = {
  id: number;
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  // having any here is okay, different qbo exports has different structures
  response_logs: any;
  export_type: string;
  exported_at: Date;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: number[];
};

export type ExpenseGroupDescription = {
  claim_number: string;
  employee_email: string;
};
