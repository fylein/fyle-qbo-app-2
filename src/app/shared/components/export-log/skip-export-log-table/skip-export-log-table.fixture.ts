import { SkipExportList } from "src/app/core/models/db/expense-group.model";
import { FyleReferenceType } from "src/app/core/models/enum/enum.model";

export const EXPENSE_GROUP_LISTS: SkipExportList[] = [
  {
    updated_at: new Date(),
    employee: ['Ashwin', 'ashwin.t@fyle.in'],
    expenseType: 'Credit Card',
    claim_number: 'E/2021/11/R/2',
  }
];
