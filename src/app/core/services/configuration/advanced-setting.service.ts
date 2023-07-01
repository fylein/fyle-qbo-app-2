import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingGet, AdvancedSettingPost, AdvancedSettingWorkspaceSchedulePost } from '../../models/configuration/advanced-setting.model';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { ExpenseFilterResponse, SkipExport } from '../../models/misc/skip-export.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const advancedSettingsCache$ = new Subject<void>();
const skipExportCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class AdvancedSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<AdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(exportSettingsPayload: AdvancedSettingPost): Observable<AdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, exportSettingsPayload);
  }

  @Cacheable({
    cacheBusterObserver: skipExportCache
  })
  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: skipExportCache
  })
  postExpenseFilter(skipExport: SkipExport): Observable<SkipExport> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, skipExport);
  }

  @CacheBuster({
    cacheBusterNotifier: skipExportCache
  })
  deleteExpenseFilter(rank: number): Observable<SkipExport> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/?rank=${rank}`);
  }

  getWorkspaceAdmins(): Observable<[WorkspaceScheduleEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
