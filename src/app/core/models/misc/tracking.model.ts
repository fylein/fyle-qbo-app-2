import { CorporateCreditCardExpensesObject, ProgressPhase, ReimbursableExpensesObject } from "../enum/enum.model";

export type ClickEventAdditionalProperty = {
  phase: ProgressPhase,
  exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject | null,
  previousPageNumber: number,
  newPageNumber: number,
  page: string
};
