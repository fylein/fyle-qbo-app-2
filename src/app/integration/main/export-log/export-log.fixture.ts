import { ExpenseGroupList, ExpenseGroupResponse } from "src/app/core/models/db/expense-group.model";
import { FyleReferenceType } from "src/app/core/models/enum/enum.model";
import { environment } from "src/environments/environment";

const FYLE_APP_URL = environment.fyle_app_url;
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
export const pageinatorResponse = {
  offset: 0,
  limit: 50
};
export const expenseGroupresponse: ExpenseGroupResponse= {
  count: 0,
  next: 'null',
  previous: "xxx",
  results: [
    {
      id: 1,
      fund_source: 'dummy',
      description: {
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT,
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
      },
      response_logs: [],
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 2,
      expenses: [
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
      ]
    }
  ]
};
export const expenseGroupresponse1: ExpenseGroupResponse= {
  count: 0,
  next: 'null',
  previous: "xxx",
  results: [
    {
      id: 1,
      fund_source: 'dummy',
      description: {
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT,
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
      },
      response_logs: [],
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 2,
      expenses: [
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
      ]
    }
  ]
};
export const exportTyperesponse = ['expense', 1, 'expense'];
export const fyleURLresponse:string = `${FYLE_APP_URL}/app/admin/#/settlements/settlement_id?org_id=dummy`;