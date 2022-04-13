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
        successful_expenses: 12,
        failed_expenses: 8,
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
