import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { ExportSettingGet, ExportSettingPost } from '../models/export-setting.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';

const exportSettingsCache$ = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class ExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: exportSettingsCache$
  })
  getExportSettings(): Observable<ExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock2/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: exportSettingsCache$
  })
  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock2/`, exportSettingsPayload);
  }
}
