import { ErrorType } from "src/app/core/models/enum/enum.model";
import { Error } from 'src/app/core/models/db/error.model';

export const modelData: Error = {
  id: 1,
  type: ErrorType.CATEGORY_MAPPING,
  expense_group: {
    id: 1,
    fund_source: 'Credit Card',
    description: {"report_id": "rp3YxnytLrgS", "claim_number": "C/2022/05/R/11", "employee_email": "sravan.kumar@fyle.in", "settlement_id": "ss", "expense_id": '1'},
    response_logs: [],
    export_type: 'Fyle',
    employee_name: 'Aswin',
    exported_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 1,
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
  },
  expense_attribute: {
    id: 1,
    attribute_type: "string",
    display_name: "string",
    value: "string",
    source_id: 1,
    auto_mapped: true,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 1,
    detail: {
      location: "string",
      full_name: "string",
      department_id: "string",
      department: "string",
      department_code: "string",
      employee_code: "string"
    }
  },
  is_resolved: true,
  error_title: "string",
  error_detail: "string",
  workspace_id: 1,
  created_at: new Date(),
  updated_at: new Date()
};