import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { WorkspaceGeneralSetting } from '../../models/db/workspace-general-setting.model';
import { Workspace } from '../../models/db/workspace.model';
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

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspace(orgId: string): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/`, {});
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
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/refresh_dimensions/`, {});
  }

  refreshQBODimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/qbo/refresh_dimensions/`, {});
  }

  getWorkspaceGeneralSettings(): Observable<WorkspaceGeneralSetting> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/settings/general/`, {});
  }
}
