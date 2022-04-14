import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Error } from '../../models/db/error.model';
import { PastExport } from '../../models/db/past-export.model';
import { TaskGetParams, TaskResponse } from '../../models/db/task-log.model';
import { ErrorType } from '../../models/enum/enum.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  // TODO: cleanup all methods once dashboard impl is done

  getExportableGroupsIds(): Observable<number[]> {
    // TODO: connect API
    return new Observable(observer => {
      observer.next([41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29]);
      observer.complete();
    });
  }

  getExportErrors(): Observable<Error[]> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
  }

  exportExpenseGroups(expenseGroupIds: number[]): Observable<{}> {
    // TODO: connect API
    return new Observable(observer => {
      observer.next({});
      observer.complete();
    });
  }

  getPastExport(): Observable<PastExport> {
     // TODO: connect API
    return new Observable(observer => {
      observer.next({
        mode: 'Manual',
        exported_at: new Date(),
        workspace_id: 1,
        total_expenses: 20,
        successful_expenses: [
          {
            "id": 32,
            "expenses": [
              {
                "id": 116,
                "employee_email": "admin1@fyleforbill.cct",
                "employee_name": "Theresa Brown",
                "category": "Food",
                "sub_category": "Food",
                "project": "Project 4",
                "org_id": "orGcBCVPijjO",
                "expense_id": "txfSGnEy07g1",
                "expense_number": "E/2021/05/T/20",
                "claim_number": "C/2021/05/R/4",
                "amount": 778.0,
                "currency": "USD",
                "foreign_amount": null,
                "foreign_currency": null,
                "tax_amount": null,
                "tax_group_id": null,
                "settlement_id": "setQj4DfmhdEN",
                "reimbursable": true,
                "billable": null,
                "exported": false,
                "state": "PAYMENT_PROCESSING",
                "vendor": null,
                "cost_center": "Administration",
                "purpose": null,
                "report_id": "rpjo18Eiq5CX",
                "corporate_card_id": null,
                "file_ids": [
                  "fiJ3TQEGdI4z"
                ],
                "spent_at": "2020-05-14T10:00:00Z",
                "approved_at": "2021-05-25T16:01:20.606000Z",
                "expense_created_at": "2021-05-25T15:59:41.826287Z",
                "expense_updated_at": "2022-04-07T07:31:51.622308Z",
                "created_at": "2022-04-13T13:50:13.496733Z",
                "updated_at": "2022-04-13T13:50:13.496737Z",
                "fund_source": "PERSONAL",
                "verified_at": null,
                "custom_properties": {},
                "paid_on_qbo": false
              }
            ],
            "fund_source": "PERSONAL",
            "description": {
              "report_id": "rpjo18Eiq5CX",
              "claim_number": "C/2021/05/R/4",
              "employee_email": "admin1@fyleforbill.cct"
            },
            "response_logs": {"time": "2021-12-05T21:26:03.545-08:00", "Purchase": {"Id": "1916", "Line": [{"Id": "1", "Amount": 573.0, "DetailType": "AccountBasedExpenseLineDetail", "Description": "Expense by user9@fyleforbill.cct against category Food spent on 2020-05-08  with report number - C/2021/05/R/43 - - https://staging.fyle.tech/app/main/#/enterprise/view_expense/txBCgv92zbXV?org_id=orGcBCVPijjO", "AccountBasedExpenseLineDetail": {"AccountRef": {"name": "3510 Food", "value": "106"}, "TaxCodeRef": {"value": "NON"}, "BillableStatus": "NotBillable"}}, {"Id": "2", "Amount": 684.0, "DetailType": "AccountBasedExpenseLineDetail", "Description": "Expense by user9@fyleforbill.cct against category Software spent on 2020-05-10  with report number - C/2021/05/R/43 - - https://staging.fyle.tech/app/main/#/enterprise/view_expense/txIKi6uzde4A?org_id=orGcBCVPijjO", "AccountBasedExpenseLineDetail": {"AccountRef": {"name": "3521 Software", "value": "117"}, "TaxCodeRef": {"value": "NON"}, "BillableStatus": "NotBillable"}}, {"Id": "3", "Amount": 963.0, "DetailType": "AccountBasedExpenseLineDetail", "Description": "Expense by user9@fyleforbill.cct against category Others spent on 2020-05-13  with report number - C/2021/05/R/43 - - https://staging.fyle.tech/app/main/#/enterprise/view_expense/txX3u2DSWHb4?org_id=orGcBCVPijjO", "AccountBasedExpenseLineDetail": {"AccountRef": {"name": "35020 Others", "value": "123"}, "TaxCodeRef": {"value": "NON"}, "BillableStatus": "NotBillable"}}, {"Id": "4", "Amount": 644.0, "DetailType": "AccountBasedExpenseLineDetail", "Description": "Expense by user9@fyleforbill.cct against category Office Supplies spent on 2020-05-11  with report number - C/2021/05/R/43 - - https://staging.fyle.tech/app/main/#/enterprise/view_expense/txZSqVXLgXQs?org_id=orGcBCVPijjO", "AccountBasedExpenseLineDetail": {"AccountRef": {"name": "3512 Bus", "value": "108"}, "TaxCodeRef": {"value": "NON"}, "BillableStatus": "NotBillable"}}], "domain": "QBO", "sparse": false, "TxnDate": "2021-12-06", "MetaData": {"CreateTime": "2021-12-05T21:26:03-08:00", "LastUpdatedTime": "2021-12-05T21:26:03-08:00"}, "TotalAmt": 2864.0, "EntityRef": {"name": "Chethan M", "type": "Employee", "value": "105"}, "SyncToken": "0", "AccountRef": {"name": "Checking", "value": "35"}, "PurchaseEx": {"any": [{"nil": false, "name": "{http://schema.intuit.com/finance/v3}NameValue", "scope": "javax.xml.bind.JAXBElement$GlobalScope", "value": {"Name": "TxnType", "Value": "3"}, "globalScope": true, "declaredType": "com.intuit.schema.finance.v3.NameValue", "typeSubstituted": false}]}, "CurrencyRef": {"name": "United States Dollar", "value": "USD"}, "CustomField": [], "PaymentType": "Check", "PrintStatus": "NotSet", "PrivateNote": "Reimbursable expense by user9@fyleforbill.cct"}},
            "employee_name": "Theresa Brown",
            "created_at": new Date(),
            "exported_at": new Date(),
            "updated_at": new Date(),
            "workspace": 13
          },
        ],
        failed_expenses: [
          {
            "id": 32,
            "expenses": [
              {
                "id": 116,
                "employee_email": "admin1@fyleforbill.cct",
                "employee_name": "Theresa Brown",
                "category": "Food",
                "sub_category": "Food",
                "project": "Project 4",
                "org_id": "orGcBCVPijjO",
                "expense_id": "txfSGnEy07g1",
                "expense_number": "E/2021/05/T/20",
                "claim_number": "C/2021/05/R/4",
                "amount": 778.0,
                "currency": "USD",
                "foreign_amount": null,
                "foreign_currency": null,
                "tax_amount": null,
                "tax_group_id": null,
                "settlement_id": "setQj4DfmhdEN",
                "reimbursable": true,
                "billable": null,
                "exported": false,
                "state": "PAYMENT_PROCESSING",
                "vendor": null,
                "cost_center": "Administration",
                "purpose": null,
                "report_id": "rpjo18Eiq5CX",
                "corporate_card_id": null,
                "file_ids": [
                  "fiJ3TQEGdI4z"
                ],
                "spent_at": "2020-05-14T10:00:00Z",
                "approved_at": "2021-05-25T16:01:20.606000Z",
                "expense_created_at": "2021-05-25T15:59:41.826287Z",
                "expense_updated_at": "2022-04-07T07:31:51.622308Z",
                "created_at": "2022-04-13T13:50:13.496733Z",
                "updated_at": "2022-04-13T13:50:13.496737Z",
                "fund_source": "PERSONAL",
                "verified_at": null,
                "custom_properties": {},
                "paid_on_qbo": false
              }
            ],
            "fund_source": "PERSONAL",
            "description": {
              "report_id": "rpjo18Eiq5CX",
              "claim_number": "C/2021/05/R/4",
              "employee_email": "admin1@fyleforbill.cct"
            },
            "response_logs": null,
            "employee_name": "Theresa Brown",
            "created_at": new Date(),
            "exported_at": new Date(),
            "updated_at": new Date(),
            "workspace": 13
          },
        ],
        created_at: new Date(),
        updated_at: new Date()
      });
      observer.complete();
    });
  }

  getAllTasks(status: string[], expenseGroupIds: number[] = [], taskType: string[] = []): Observable<TaskResponse> {
    const limit = 500;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks));
  }

  private getAllTasksInternal(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], allTasks: TaskResponse): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(limit, status, expenseGroupIds, taskType, allTasks.next).toPromise().then((taskResponse) => {
      if (allTasks.count === 0) {
        allTasks = taskResponse;
      } else {
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (taskResponse.next) {
        return that.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks);
      } else {
        return allTasks;
      }
    });
  }

  getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string | null): Observable<TaskResponse> {
    const offset = 0;
    const apiParams: TaskGetParams = {
      limit,
      offset,
      status
    };

    if (expenseGroupIds && taskType) {
      const expenseKey = 'expense_group_ids';
      const typeKey = 'task_type';
      apiParams[expenseKey] = expenseGroupIds;
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('api')[1], {});
    } else {
      return this.apiService.get(
        `/workspaces/${this.workspaceId}/tasks/all/`, apiParams
      );
    }
  }

}
