import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { WorkspaceSchedule } from '../../models/db/schedule-setting.model';
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

  postScheduleSettings(hours: number, scheduleEnabled: boolean, selectedEmail: [], addedEmail: {}): Observable<WorkspaceSchedule> {
    const workspaceId =  this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      hours,
      schedule_enabled: scheduleEnabled,
      added_email: addedEmail,
      selected_email: selectedEmail
    });
  }

  getWorkspaceAdmins(): Observable<[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }

  getScheduleSettings(): Observable<WorkspaceSchedule> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/schedule/`, {});
  }
}
