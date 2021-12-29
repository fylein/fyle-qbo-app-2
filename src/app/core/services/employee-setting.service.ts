import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { EmployeeSetting, ExtendedEmployeeSetting } from '../models/employee-setting.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';


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
  getEmployeeSettings(): Observable<EmployeeSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock/`, {}).pipe(
      map((data: ExtendedEmployeeSetting) => data.workspace_general_settings)
    );
  }

  @CacheBuster({
    cacheBusterNotifier: employeeSettingsCache$
  })
  postEmployeeSettings(employeeSettingsPayload: ExtendedEmployeeSetting): Observable<EmployeeSetting> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mock/`, employeeSettingsPayload).pipe(
      map((data: ExtendedEmployeeSetting) => data.workspace_general_settings)
    );
  }
}
