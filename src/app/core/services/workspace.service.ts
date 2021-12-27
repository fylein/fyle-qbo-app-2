import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { Workspace } from '../models/workspace.model';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  getWorkspaceId(): string | null {
    return this.storageService.get('workspaceId');
  }

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  @Cacheable()
  getWorkspaces(orgId: string): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }
}
