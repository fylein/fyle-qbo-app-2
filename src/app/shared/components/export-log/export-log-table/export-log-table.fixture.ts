import { ExpenseGroupList } from "src/app/core/models/db/expense-group.model";
import { FyleReferenceType } from "src/app/core/models/enum/enum.model";

export const EXPENSE_GROUP_LISTS: ExpenseGroupList[] = [
  {
    exportedAt: new Date(),
    employee: ['Ashwin', 'ashwin.t@fyle.in'],
    expenseType: 'Credit Card',
    referenceNumber: 'E/2021/11/R/2',
    exportedAs: 'Journal Entry',
    qboUrl: 'https://fylehq.com',
    fyleUrl: 'https://fylehq.com',
    fyleReferenceType: FyleReferenceType.EXPENSE,
    expenses: []
  }
];
