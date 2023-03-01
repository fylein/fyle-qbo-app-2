import { JoinOption, Operator } from "../enum/enum.model";

export type SkipExport = {
  condition: string;
  custom_field_type: any;
  operator: Operator.IsNull | Operator.IExact | Operator.IContains | Operator.LessThan | Operator.LessThanOrEqual;
  values: string[];
  rank: number;
  join_by: JoinOption.AND | JoinOption.OR | null;
  is_custom: boolean;
};

export type ExpenseFilterResponse = {
  count: number;
  results: SkipExport[];
};

export type ConditionField = {
  field_name: string;
  type: string;
  is_custom: boolean;
};