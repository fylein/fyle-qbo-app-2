import { FyleReferenceType } from "../enum/enum.model";
import { Expense } from "./expense.model";

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
  qboUrl: string;
  fyleUrl: string;
  fyleReferenceType: FyleReferenceType;
  expenses: Expense[];
}

export type ExpenseGroup = {
  id: number;
  // TODO: check and remove this
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  // having any here is okay, different qbo exports has different structures
  response_logs: any;
  export_type: string;
  employee_name: string;
  exported_at: Date;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  // TODO: change this after API connect
  expenses: any[]; // Expense[];
};

export type ExpenseGroupDescription = {
  claim_number: FyleReferenceType.EXPENSE_REPORT;
  report_id: FyleReferenceType.EXPENSE_REPORT;
  employee_email: string;
  expense_id: FyleReferenceType.EXPENSE;
  settlement_id: FyleReferenceType.PAYMENT;
};
