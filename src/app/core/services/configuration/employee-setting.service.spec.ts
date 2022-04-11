import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeSettingService } from './employee-setting.service';
import { EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping } from '../../models/enum/enum.model';

describe('EmployeeSettingService', () => {
  let service: EmployeeSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(EmployeeSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEmployeeSettings service check', () => {
    expect(service.getEmployeeSettings()).toBeTruthy()
  })

  it('postEmployeeSettings service check', () => {
    const employeeSettingPayload: EmployeeSettingPost= {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
      }
    };
    expect(service.postEmployeeSettings(employeeSettingPayload)).toBeTruthy()
  })
});
