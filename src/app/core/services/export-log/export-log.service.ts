import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseGroupResponse } from '../../models/db/expense-group.model';
import { Expense } from '../../models/db/expense.model';
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

  getExpenseGroups(state: string, limit: number, offset: number): Observable<ExpenseGroupResponse> {
    return this.apiService.get(
      `/workspaces/${this.workspaceId}/fyle/expense_groups/`,
      {
        limit,
        offset,
        state
      }
    );
  }

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }
}
