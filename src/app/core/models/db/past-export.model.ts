// TODO: rename based on table name

export type PastExport = {
  mode: string;
  exported_at: Date;
  workspace_id: number;
  total_expenses: number;
  successful_expenses: number;
  failed_expenses: number;
  created_at: Date;
  updated_at: Date;
}