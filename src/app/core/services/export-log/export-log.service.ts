import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse, SkipExportLogResponse } from '../../models/db/expense-group.model';
import { FyleReferenceType, TaskLogState } from '../../models/enum/enum.model';
import { SelectedDateFilter } from '../../models/misc/date-filter.model';
import { ApiService } from '../core/api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';


@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile().org_id;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  getExpenseGroups(state: TaskLogState, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: string | void): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset
    };
    params.tasklog__status = state;
    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.exported_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.exported_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }

  @Cacheable()
  getSkippedExpenses(limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null): Observable<SkipExportLogResponse> {
    const params: any = {
      limit,
      offset,
      is_skipped: 'true',
      org_id: this.org_id
    };

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.updated_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.updated_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expenses/`, params);
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

  getReferenceType(description: Partial<ExpenseGroupDescription>): FyleReferenceType {
    let referenceType = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceType = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceType = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceType = FyleReferenceType.PAYMENT;
    }

    return referenceType;
  }

  generateFyleUrl(expenseGroup: ExpenseGroup, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `admin/#/view_expense/${expenseGroup.description.expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `admin/#/reports/${expenseGroup.description.report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${expenseGroup.description.settlement_id}`;
    }

    return `${url}?org_id=${this.org_id}`;
  }
}
