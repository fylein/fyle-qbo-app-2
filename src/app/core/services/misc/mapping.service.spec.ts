import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MappingService } from './mapping.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { EmployeeFieldMapping, FyleField, MappingState, QBOField } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { MappingPost, MappingStats } from '../../models/db/mapping.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { EmployeeMapping, EmployeeMappingPost } from '../../models/db/employee-mapping.model';
import { DestinationAttribute } from '../../models/db/destination-attribute.model';

describe('MappingService', () => {
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [MappingService]
    });
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDistinctQBODestinationAttributes() service check', () => {
    service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`
    });
      req.flush([]);

  });

  it('getQBODestinationAttributes() service check', () => {
    service.getQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=EMPLOYEE,VENDOR`
    });
      req.flush([]);

  });

  it('getDistinctQBODestinationAttributes() service check', () => {
    service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`
    });
      req.flush([]);
  });

  it('getFyleExpenseFields() service check', () => {
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
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_fields/`
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
    service.getMappings(MappingState.ALL, true, 1, 1, [], FyleField.CATEGORY, QBOField.ACCOUNT).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY&destination_type=ACCOUNT`
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
    service.getMappings(MappingState.UNMAPPED, true, 1, 1, ['all'], FyleField.CATEGORY, QBOField.ACCOUNT).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&all_alphabets=true&mapped=false&mapping_source_alphabets=all&source_type=CATEGORY&destination_type=ACCOUNT`
    });
      req.flush(response);
  });

  it('getQBOEmployees() service check', () => {
    service.getQBOEmployees().subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`
    });
      req.flush([]);
  });

  it('getQBOVendors() service check', () => {
    service.getQBOVendors().subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/vendors/`
    });
      req.flush([]);
  });

  it('getMappingSettings() service check', () => {
    const response:MappingSettingResponse = {
      count: 0, next: 'aa', previous: 'aa', results: []};
    service.getMappingSettings().subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });
      req.flush(response);
  });

  it('getMappingStats() service check', () => {
    const response:MappingStats= {
      all_attributes_count: 3,
      unmapped_attributes_count: 3
    };
    service.getMappingStats(EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=EMPLOYEE&destination_type=VENDOR`
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
    service.getEmployeeMappings(MappingState.ALL, true, 1, 1, [], EmployeeFieldMapping.EMPLOYEE).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&destination_type=EMPLOYEE`
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
    service.getEmployeeMappings(MappingState.UNMAPPED, true, 1, 1, ['all'], EmployeeFieldMapping.EMPLOYEE).subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?limit=1&offset=1&all_alphabets=true&mapped=false&mapping_source_alphabets=all&destination_type=EMPLOYEE`
    });
      req.flush(response);
  });

  it('getQBOEmployees() service check', () => {
    service.triggerAutoMapEmployees().subscribe(value => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/auto_map_employees/trigger/`
    });
      req.flush({});
  });

  xit('getGroupedQBODestinationAttributes() withdata service check', () => {
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    const response = {
      BANK_ACCOUNT: [],
      CREDIT_CARD_ACCOUNT: [],
      ACCOUNTS_PAYABLE: [],
      VENDOR: [],
      ACCOUNT: [],
      TAX_CODE: []
    };
    service.getGroupedQBODestinationAttributes(destinationAttributes).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=BANK_ACCOUNT,CREDIT_CARD_ACCOUNT,ACCOUNTS_PAYABLE,VENDOR`
    });
      req.flush([{"id": 45531, "attribute_type": "CREDIT_CARD_ACCOUNT", "display_name": "Credit Card Account", "value": "2285 Fyle Credit Card", "destination_id": "106", "auto_created": false, "active": null, "detail": {"account_type": "Credit Card", "fully_qualified_name": "2285 Fyle Credit Card"}, "created_at": "2022-04-14T06:09:07.537182Z", "updated_at": "2022-04-14T06:09:07.537205Z", "workspace": 216}]);
  });

  xit('getGroupedQBODestinationAttributes() without data service check', () => {
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    const response = {
      BANK_ACCOUNT: [],
      CREDIT_CARD_ACCOUNT: [],
      ACCOUNTS_PAYABLE: [],
      VENDOR: [],
      ACCOUNT: [],
      TAX_CODE: []
    };
    service.getGroupedQBODestinationAttributes(destinationAttributes).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=BANK_ACCOUNT,CREDIT_CARD_ACCOUNT,ACCOUNTS_PAYABLE,VENDOR`
    });
      req.flush([]);
  });

  it('postmapping() service check', () => {
    const payload:MappingPost = {
      source_type: 'Payment',
      source_value: 'dummy',
      destination_type: 'Expence',
      destination_id: '1',
      destination_value: 'dummy'
    };
    const destination:DestinationAttribute = {
      id: 1,
      attribute_type: 'VENDOR',
      display_name: 'Vendor',
      value: 'dummy',
      destination_id: '1',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      detail: {
        email: 'dummy@gmail.com',
        fully_qualified_name: 'Fyle'
      }
    };
    const response:EmployeeMapping = {
      id: 1,
      source_employee: {
        id: 1,
        attribute_type: 'VENDOR',
        display_name: 'Vendor',
        value: 'dummy',
        source_id: 1,
        auto_mapped: true,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: +workspace_id,
        detail: {
          location: 'india',
          full_name: 'Fyle Integrations',
          department_id: '2',
          department: 'Integrations',
          department_code: 'FYI2',
          employee_code: 'FYIE1'
        }
      },
      destination_employee: destination,
      destination_vendor: destination,
      destination_card_account: destination,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id
    };

    service.postMapping(payload).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
      req.flush(response);
  });

  it('postEmployeemapping() service check', () => {
    const payload: EmployeeMappingPost ={
      source_employee: {
        id: 1
      },
      destination_employee: {
        id: 1
      },
      destination_vendor: {
        id: 1
      },
      destination_card_account: {
        id: 1
      },
      workspace: +workspace_id
    };

    const destination:DestinationAttribute = {
      id: 1,
      attribute_type: 'VENDOR',
      display_name: 'Vendor',
      value: 'dummy',
      destination_id: '1',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      detail: {
        email: 'dummy@gmail.com',
        fully_qualified_name: 'Fyle'
      }
    };

    const response: EmployeeMapping = {
      id: 1,
      source_employee: {
        id: 1,
        attribute_type: 'VENDOR',
        display_name: 'Vendor',
        value: 'dummy',
        source_id: 1,
        auto_mapped: true,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: +workspace_id,
        detail: {
          location: 'india',
          full_name: 'Fyle Integrations',
          department_id: '2',
          department: 'Integrations',
          department_code: 'FYI2',
          employee_code: 'FYIE1'
        }
      },
      destination_employee: destination,
      destination_vendor: destination,
      destination_card_account: destination,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id
    };
    service.postEmployeeMapping(payload).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee/`
    });
      req.flush(response);
  });
});
