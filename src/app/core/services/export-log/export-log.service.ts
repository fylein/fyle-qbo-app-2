import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseGroupResponse } from '../../models/db/expense-group.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';


@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExpenseGroups(state: string, limit: number = 10, offset: number = 0): Observable<ExpenseGroupResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/fyle/expense_groups/`,
      {
        limit,
        offset,
        state
      }
    );
  }
}
