import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MappingService } from './mapping.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { EmployeeFieldMapping, FyleField, MappingState, QBOField } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { MappingStats } from '../../models/db/mapping.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';

describe('MappingService', () => {
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,HttpClientTestingModule],
      providers: [MappingService]
    });
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQBODestinationAttributes() service check', () => {
    service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`,
    });
      req.flush([]);

  });

  it('getDistinctQBODestinationAttributes() service check', () => {
    service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`,
    });
      req.flush([]);
  });

  it('getFyleExpenseFields() service check',() => {
    const response:ExpenseField[]=[
      {
          "attribute_type": "COST_CENTER",
          "display_name": "Cost Center"
      },
      {
          "attribute_type": "PROJECT",
          "display_name": "Project"
      },
      {
          "attribute_type": "REGION",
          "display_name": "Region"
      },
      {
          "attribute_type": "XERO_REGION",
          "display_name": "Xero Region"
      },
      {
          "attribute_type": "XERO_ITEM",
          "display_name": "Xero Item"
      },
      {
          "attribute_type": "XERO_FIELD",
          "display_name": "Xero Field"
      }
  ];
    service.getFyleExpenseFields().subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_fields/`,
    });
      req.flush(response);
  });

  it('getMappings() service check', () => {
    const response={
      "count": 125,
      "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
      "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
      "results": [
        {
          "id": 36,
          "mapping": [],
          "attribute_type": "CATEGORY",
          "display_name": "Category",
          "value": "Advertising",
          "source_id": 186449,
          "auto_mapped": false,
          "auto_created": false,
          "active": false,
          "detail": null,
          "created_at": new Date("2022-04-29T07:14:58.746099Z"),
          "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
          "workspace": 1
      }
      ]
  };
    service.getMappings(MappingState.ALL,true,1,1,[],FyleField.CATEGORY,QBOField.ACCOUNT).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY&destination_type=ACCOUNT`,
    });
      req.flush(response);
  });

  it('getQBOEmployees() service check', () => {
    service.getQBOEmployees().subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`,
    });
      req.flush([]);
  });

  it('getQBOVendors() service check', () => {
    service.getQBOVendors().subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/vendors/`,
    });
      req.flush([]);
  });

  it('getMappingSettings() service check', () => {
    const response:MappingSettingResponse = {
      count: 0,next: 'aa',previous: 'aa',results: []};
    service.getMappingSettings().subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`,
    });
      req.flush(response);
  });

  it('getMappingStats() service check', () => {
    const response:MappingStats= {
      all_attributes_count: 3,
      unmapped_attributes_count: 3
    };
    service.getMappingStats(EmployeeFieldMapping.EMPLOYEE,EmployeeFieldMapping.VENDOR).subscribe((value)=>{
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=EMPLOYEE&destination_type=VENDOR`,
    });
      req.flush(response);
  });

  it('getMappings() service check', () => {
    const response={
      "count": 3,
      "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null&offset=2`,
      "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null`,
      "results": [
        {
          "id": 3,
          "employeemapping": [],
          "attribute_type": "EMPLOYEE",
          "display_name": "Employee",
          "value": "gokul.kathiresan@fyle.in",
          "source_id": "oupTTvXHXCuk",
          "auto_mapped": false,
          "auto_created": false,
          "active": null,
          "detail": {
              "user_id": "usCPKib1GyYP",
              "location": null,
              "full_name": "Gokul",
              "department": null,
              "department_id": null,
              "employee_code": null,
              "department_code": null
          },
          "created_at": new Date("2022-04-29T07:14:57.819103Z"),
          "updated_at": new Date("2022-04-29T07:14:57.819149Z"),
          "workspace": workspace_id
        }
      ]
  };
    service.getEmployeeMappings(MappingState.ALL,true,1,1,[],EmployeeFieldMapping.EMPLOYEE).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&destination_type=EMPLOYEE`,
    });
      req.flush(response);
  });
  
  it('getQBOEmployees() service check', () => {
    service.triggerAutoMapEmployees().subscribe(value => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/auto_map_employees/trigger/`,
    });
      req.flush({});
  });

});
