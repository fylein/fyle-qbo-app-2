import { Expense, ExpenseList } from "src/app/core/models/db/expense.model";
import { MinimalUser } from "src/app/core/models/db/user.model";

export const expense: Expense[] = [
  {
    amount: 1,
    approved_at: new Date(),
    category: 'string',
    claim_number: 'string',
    cost_center: 'string',
    created_at: new Date(),
    currency: 'string',
    employee_email: 'string',
    expense_created_at: new Date(),
    expense_id: 'string',
    expense_number: 'string',
    expense_updated_at: new Date(),
    exported: true,
    foreign_amount: 1,
    foreign_currency: 'string',
    fund_source: 'string',
    org_id: 'string',
    id: 1,
    project: 'string',
    purpose: 'string',
    reimbursable: true,
    report_id: 'string',
    settlement_id: 'string',
    payment_number: 'string',
    spent_at: new Date(),
    state: 'string',
    sub_category: 'string',
    updated_at: new Date(),
    vendor: 'string',
    billable: true,
    verified_at: new Date(),
    paid_on_qbo: true,
    custom_properties: []
  }
];
export const expenseList:ExpenseList[] = [{
  expenseID: '1',
  amount: [200, 'usd'],
  merchant: 'uber',
  category: 'Food',
  fyleUrl: 'https://fylehq.com',
  expenseType: 'Credit Card',
  name: ['Ashwin', 'ashwin.t@fyle.in'],
  fundSource: 'personal'
}];
export const user:MinimalUser = {
  access_token: "fyle",
  email: "sravan.kumar@fyle.in",
  full_name: "sravan k",
  org_id: "orunxXsIajSE",
  org_name: "Test Sample Statement - GBP",
  refresh_token: "fyle",
  user_id: "ust5Ga9HC3qc"
};
