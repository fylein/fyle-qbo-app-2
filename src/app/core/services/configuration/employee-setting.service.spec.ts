import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { EmployeeSettingService } from './employee-setting.service';
import { EmployeeSettingPost } from '../../models/configuration/employee-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping } from '../../models/enum/enum.model';

describe('EmployeeSettingService', () => {
  let service: EmployeeSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
      JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(EmployeeSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getEmployeeSettings service check', () => {
    expect(service.getEmployeeSettings()).toBeTruthy()
  })

  it('getEmployeeSettings service attribuite check', () => {
    const orgkey = ['workspace_general_settings']
    let keys:any[] = []
    service.getEmployeeSettings().subscribe((value) => {
      for(let key of Object.keys(value)){
        if(key == 'workspace_general_settings')
          keys.push(key)
      }
      expect(keys).toEqual(orgkey)
    })
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
