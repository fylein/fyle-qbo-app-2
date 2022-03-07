import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { ImportSettingGet, ImportSettingPost } from '../../models/import-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const importSettingsCache$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class ImportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: importSettingsCache$
  })
  getImportSettings(): Observable<ImportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock3/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: importSettingsCache$
  })
  postImportSettings(exportSettingsPayload: ImportSettingPost): Observable<ImportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock3/`, exportSettingsPayload);
  }
}
