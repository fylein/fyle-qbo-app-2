import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from "../enum/enum.model";

export type PreviewPage = {
  fyleExpense?: boolean,
  qboReimburse?: ReimbursableExpensesObject | null,
  qboCCC?: CorporateCreditCardExpensesObject | null
};