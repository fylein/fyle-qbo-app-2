import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse } from '../../models/db/expense-group.model';
import { FyleReferenceType } from '../../models/enum/enum.model';
import { SelectedDateFilter } from '../../models/misc/date-filter.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';


@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExpenseGroups(state: string, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset,
      state
    };

    if (selectedDateFilter) {
      params['start_date'] = selectedDateFilter.startDate.toISOString().split('T')[0];
      params['end_date'] = selectedDateFilter.endDate.toISOString().split('T')[0];
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }

  generateExportTypeAndId(expenseGroup: ExpenseGroup) {
    let exportRedirection = null;
    let exportType = null;
    let exportId = null;

    if ('Bill' in expenseGroup.response_logs && expenseGroup.response_logs.Bill) {
      exportRedirection = 'bill';
      exportType = exportRedirection;
      exportId = expenseGroup.response_logs.Bill.Id;
    } else if ('JournalEntry' in expenseGroup.response_logs && expenseGroup.response_logs.JournalEntry) {
      exportRedirection = 'journal';
      exportType = 'Journal Entry';
      exportId = expenseGroup.response_logs.JournalEntry.Id;
    } else if ('Purchase' in expenseGroup.response_logs && expenseGroup.response_logs.Purchase) {
      exportId = expenseGroup.response_logs.Purchase.Id;
      if (expenseGroup.response_logs.Purchase.PaymentType === 'Check') {
        exportRedirection = 'check';
        exportType = exportRedirection;
      } else {
        exportRedirection = 'expense';
        if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && !expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Purchase';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Credit';
          exportRedirection = 'creditcardcredit';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'Cash') {
          exportType = 'Debit Card Expense';
          exportRedirection = 'expense';
        } else {
          exportType = 'expense';
        }
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  getReferenceNumber(description: ExpenseGroupDescription): FyleReferenceType {
    let referenceNumber = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceNumber = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceNumber = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceNumber = FyleReferenceType.PAYMENT;
    }

    return referenceNumber;
  }

  generateFyleUrl(expenseGroup: ExpenseGroup, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/admin/#`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      // TODO: add org_id to fyle url
      url += `/view_expense/${expenseGroup.description.expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `/reports/${expenseGroup.description.report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `/settlements/${expenseGroup.description.settlement_id}`;
    }

    return url;
  }
}
