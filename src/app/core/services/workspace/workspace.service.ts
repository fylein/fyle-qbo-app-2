import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { WorkspaceGeneralSetting } from '../../models/db/workspace-general-setting.model';
import { Workspace } from '../../models/db/workspace.model';
import { OnboardingState } from '../../models/enum/enum.model';
import { ApiService } from '../core/api.service';
import { StorageService } from '../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  getFyleCurrency(): string {
    return this.storageService.get('currency');
  }

  getWorkspaceCreatedAt(): Date {
    return new Date(this.storageService.get('workspaceCreatedAt'));
  }

  setOnboardingState(onboardingState: OnboardingState): void {
    return this.storageService.set('onboardingState', onboardingState);
  }

  getOnboardingState(): OnboardingState {
    return this.storageService.get('onboardingState');
  }

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  patchWorkspace(): Observable<Workspace> {
    return this.apiService.patch(`/workspaces/${this.getWorkspaceId()}/`, {app_version: 'v1'});
  }

  @Cacheable()
  getWorkspaces(orgId: string): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  syncQBODimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/qbo/sync_dimensions/`, {});
  }

  refreshFyleDimensions(): Observable<{}> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/refresh_dimensions/`, {});
  }

  refreshQBODimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/qbo/refresh_dimensions/`, {});
  }

  // TODO: Cache this call safely
  getWorkspaceGeneralSettings(): Observable<WorkspaceGeneralSetting> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/settings/general/`, {});
  }
}
