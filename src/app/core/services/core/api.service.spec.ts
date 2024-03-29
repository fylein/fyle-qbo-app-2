import { getTestBed, TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { Workspace } from '../../models/db/workspace.model';
import { AutoMapEmployee, EmployeeFieldMapping, OnboardingState } from '../../models/enum/enum.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { EmployeeSettingPost, EmployeeSettingGet } from '../../models/configuration/employee-setting.model';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    service.post('/workspaces/', {}).subscribe((value) => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
  req.flush(responseKeys);
  });

  it('Post service error', () => {
    const responseKeys = { status: 404, statusText: "Not Found" };
    service.post('/workspaces/', {}).subscribe((value) => {
      expect(value).toEqual(responseKeys);
    },
    error => {
      expect(error.status).toBe(404);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
  req.flush('', responseKeys);
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
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    service.get("/workspaces/", {org_id: 1}).subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`
    });
  req.flush(responseKeys);
  });

  it('Get service error', () => {
    const responseKeys = { status: 404, statusText: "Not Found" };
    service.get("/workspaces/", {org_id: 1}).subscribe(value => {
    },
    error => {
      expect(error.status).toBe(404);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`
    });
  req.flush('', responseKeys);
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
    service.put('/v2/workspaces/'+workspace_id+'/map_employees/', employeeSettingPayload).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
    req.flush(response);
  });

  it('Put service error', () => {
    const employeeSettingPayload: EmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
      }
    };
    const responseKeys = { status: 404, statusText: "Not Found" };
    service.put('/v2/workspaces/'+workspace_id+'/map_employees/', employeeSettingPayload).subscribe(value => {
      expect(value).toEqual(responseKeys);
    },
    error => {
      expect(error.status).toBe(404);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
  req.flush('', responseKeys);
  });

  it('patch service check', () => {
    const response={
      app: 'done'
    };
    service.patch(`/workspaces/${workspace_id}/`, {app_version: 'v1'}).subscribe((value) => {
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });
  req.flush(response);
  });

  it('patch service error check', () => {
    const response={ status: 404, statusText: "Not Found" };
    service.patch(`/workspaces/${workspace_id}/`, {app_version: 'v1'}).subscribe((value) => {
      expect(value).toBeDefined();
    },
    error => {
      expect(error.status).toBe(404);
    });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });
  req.flush('', response);
  });

  it('Handel error service error check', () => {
    const errors = new ErrorEvent("error in back end", {message: 'error in back end', error: new Error("Error")});
    const response:HttpErrorResponse ={
      error: errors, status: 404, statusText: "Not Found",
      name: 'HttpErrorResponse',
      message: '',
      ok: false,
      headers: new HttpHeaders,
      url: null,
      type: HttpEventType.ResponseHeader
    };
    const error = (service as any).handleError(response, 'GET');
    expect(response.error.message).toEqual('error in back end');
    expect(error).toBeInstanceOf(Observable);
  });

  it('delete method test for 200', () => {
    const response = {
      app: 'deleted'
    };
    service.delete(`/workspaces/${workspace_id}/`).subscribe((value) => {
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });

    req.flush(response);
  });

  it('delete method test for 4xx', () => {
    const response = {
      status: 404,
      statusText: "Not Found"
    };

    service.delete(`/workspaces/${workspace_id}/`).subscribe((value) => {
      expect(value).toBeDefined();
    }, (error) => {
      expect(error.status).toBe(404);
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });

    req.flush('', response);
  });

});
