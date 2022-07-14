import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingGet, AdvancedSettingPost, AdvancedSettingWorkspaceSchedulePost } from '../../models/configuration/advanced-setting.model';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const advancedSettingsCache$ = new Subject<void>();
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

  postWorkspaceSchedule(data: AdvancedSettingWorkspaceSchedulePost): Observable<WorkspaceSchedule> {
    const workspaceId =  this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, data);
  }

  getWorkspaceAdmins(): Observable<[WorkspaceScheduleEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }

  getWorkspaceSchedule(): Observable<WorkspaceSchedule> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/schedule/`, {});
  }
}
