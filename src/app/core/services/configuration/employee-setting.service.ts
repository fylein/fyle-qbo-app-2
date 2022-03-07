import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { EmployeeSettingGet, EmployeeSettingPost } from '../../models/employee-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';


const employeeSettingsCache$ = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class EmployeeSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: employeeSettingsCache$
  })
  getEmployeeSettings(): Observable<EmployeeSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: employeeSettingsCache$
  })
  postEmployeeSettings(employeeSettingsPayload: EmployeeSettingPost): Observable<EmployeeSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock/`, employeeSettingsPayload);
  }
}
