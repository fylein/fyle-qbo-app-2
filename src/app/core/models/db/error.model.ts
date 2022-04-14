import { ErrorType } from "../enum/enum.model";
import { ExpenseAttribute } from "./expense-attribute.model";
import { ExpenseGroup } from "./expense-group.model";

export type Error = {
  id: number;
  type: ErrorType;
  expense_group: ExpenseGroup;
  expense_attribute: ExpenseAttribute;
  is_resolved: boolean;
  error_title: string;
  error_detail: string;
  workspace_id: number;
  created_at: Date;
  updated_at: Date;
};

export type GroupedErrors = {
  [ErrorType.EMPLOYEE_MAPPING]: Error[];
  [ErrorType.CATEGORY_MAPPING]: Error[];
  [ErrorType.QBO_ERROR]: Error[];
}

export type ErrorStat = {
  resolvedCount: number;
  totalCount: number;
}

export type GroupedErrorStat = {
  [ErrorType.EMPLOYEE_MAPPING]: null | ErrorStat;
  [ErrorType.CATEGORY_MAPPING]: null | ErrorStat;
}
