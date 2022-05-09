import { getTestBed, TestBed } from '@angular/core/testing';
import { EmployeeSettingService } from './employee-setting.service';
import { EmployeeSettingGet, EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping } from '../../models/enum/enum.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('EmployeeSettingService', () => {
  let service: EmployeeSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeSettingService]
    });
    injector = getTestBed();
    service = injector.inject(EmployeeSettingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEmployeeSettings service check', () => {
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: null },
      workspace_id: 1
    }
    service.getEmployeeSettings().subscribe((value) => {
      expect(value).toEqual(response);
    })
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/1/map_employees/`,
    });
    req.flush(response);
  })

  it('postEmployeeSettings service check', () => {
    const employeeSettingPayload: EmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
      }
    };
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
      workspace_id: 1
    }
    service.postEmployeeSettings(employeeSettingPayload).subscribe(value =>{
      expect(value).toEqual(response);
    })
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/1/map_employees/`,
    });
    req.flush(response);
  })
});
