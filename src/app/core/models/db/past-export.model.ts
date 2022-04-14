// TODO: rename based on table name

import { ExpenseGroup } from "./expense-group.model";

export type PastExport = {
  mode: string;
  exported_at: Date;
  workspace_id: number;
  total_expenses: number;
  // TODO: update
  successful_expenses: any[]; // ExpenseGroup[];
  failed_expenses: any[]; // ExpenseGroup[];
  created_at: Date;
  updated_at: Date;
}