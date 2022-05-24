import { getTestBed, TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { Workspace } from '../../models/db/workspace.model';
import { AutoMapEmployee, EmployeeFieldMapping, OnboardingState } from '../../models/enum/enum.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { EmployeeSettingPost, EmployeeSettingGet } from '../../models/configuration/employee-setting.model';

describe('ApiService', () => {
  let service: ApiService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    injector = getTestBed();
    service = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Post service', () => {
    const responseKeys:Workspace = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      fyle_currency: "ING",
      qbo_realm_id: "",
      cluster_domain: "",
      onboarding_state: OnboardingState.CONNECTION,
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z") ,
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
    };
    service.post('/workspaces/',{}).subscribe((value) => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`,
    });
  req.flush(responseKeys);
  });

  it('Get service', () => {
    const responseKeys:Workspace = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      fyle_currency: "ING",
      qbo_realm_id: "",
      cluster_domain: "",
      onboarding_state: OnboardingState.CONNECTION,
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z") ,
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
    };
    service.get("/workspaces/",{org_id: 1}).subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`,
    });
  req.flush(responseKeys);
  });

  it('Put service check', () => {
    const employeeSettingPayload: EmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
      }
    };
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
      workspace_id: 1
    };
    service.put('/v2/workspaces/'+workspace_id+'/map_employees/',employeeSettingPayload).subscribe(value =>{
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`,
    });
    req.flush(response);
  });

  it('patch service check', () => {
    const response={
      app: 'done'
    };
    service.patch(`/workspaces/${workspace_id}/`,{app_version: 'v1'}).subscribe((value)=>{
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`,
    });
  req.flush(response);
  });
});
