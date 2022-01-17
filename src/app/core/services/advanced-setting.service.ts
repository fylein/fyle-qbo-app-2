import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingGet, AdvancedSettingPost } from '../models/advanced-setting.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';

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
  getImportSettings(): Observable<AdvancedSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock4/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postImportSettings(exportSettingsPayload: AdvancedSettingPost): Observable<AdvancedSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock4/`, exportSettingsPayload);
  }
}