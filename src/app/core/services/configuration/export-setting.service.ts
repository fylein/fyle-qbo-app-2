import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class ExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(){
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost){
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
