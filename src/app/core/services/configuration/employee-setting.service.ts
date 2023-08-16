import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { EmployeeSettingFormOption, EmployeeSettingGet, EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AutoMapEmployee, EmployeeFieldMapping } from '../../models/enum/enum.model';


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

  getEmployeeFieldMappingOptions(): EmployeeSettingFormOption[] {
    return [
      {
        label: 'Employees',
        value: EmployeeFieldMapping.EMPLOYEE
      },
      {
        label: 'Vendor',
        value: EmployeeFieldMapping.VENDOR
      }
    ];
  }

  getAutoMapEmployeeOptions(): EmployeeSettingFormOption[] {
    return [
      {
        value: null,
        label: 'None'
      },
      {
        value: AutoMapEmployee.NAME,
        label: 'Fyle Name to QuickBooks Online Display name'
      },
      {
        value: AutoMapEmployee.EMAIL,
        label: 'Fyle Email to QuickBooks Online Email'
      },
      {
        value: AutoMapEmployee.EMPLOYEE_CODE,
        label: 'Fyle Employee Code to QuickBooks Online Display name'
      }
    ];
  }
}
