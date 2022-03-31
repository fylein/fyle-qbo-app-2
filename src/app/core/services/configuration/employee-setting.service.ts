import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { EmployeeSettingGet, EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
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
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: employeeSettingsCache$
  })
  postEmployeeSettings(employeeSettingsPayload: EmployeeSettingPost): Observable<EmployeeSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, employeeSettingsPayload);
  }
}
