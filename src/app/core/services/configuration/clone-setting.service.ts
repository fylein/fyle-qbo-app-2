import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloneSetting, CloneSettingExist, CloneSettingPost } from '../../models/configuration/clone-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})

export class CloneSettingService {

  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  checkCloneSettingsExists(): Observable<CloneSettingExist> {
    return this.apiService.get(`/user/clone_settings/exists/`, {});
  }

  getCloneSettings(): Observable<CloneSetting> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/clone_settings/`, {});
  }

  saveCloneSettings(cloneSettingsPayload: CloneSettingPost): Observable<CloneSetting> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/clone_settings/`, cloneSettingsPayload);
  }
}
