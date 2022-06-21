import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeSettingsComponent } from './employee-settings.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutoMapEmployee, CorporateCreditCardExpensesObject, EmployeeFieldMapping, ExpenseState, ExportDateType, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';
import { EmployeeSettingGet } from 'src/app/core/models/configuration/employee-setting.model';
import { environment } from 'src/environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ExportSettingGet } from 'src/app/core/models/configuration/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

describe('EmployeeSettingsComponent', () => {
  let component: EmployeeSettingsComponent;
  let fixture: ComponentFixture<EmployeeSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  let formBuilder: FormBuilder;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatDialogModule, SharedModule],
      declarations: [EmployeeSettingsComponent],
      providers: [{ provide: Router, useValue: routerSpy }, EmployeeSettingService, FormBuilder, ExportSettingService, MappingService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSettingsComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    const form = formBuilder.group({
      employeeMapping: ['EMPLOYEE'],
      autoMapEmployee: [true]
    });
    component.employeeSettingsForm = form;
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
      workspace_id: 1
    };
    const response1: ExportSettingGet = {
      expense_group_settings: {
        expense_state: ExpenseState.PAID,
        reimbursable_expense_group_fields: ['sample'],
        reimbursable_export_date_type: ExportDateType.APPROVED_AT,
        corporate_credit_card_expense_group_fields: ['sipper'],
        ccc_export_date_type: ExportDateType.SPENT_AT
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL
      },
      general_mappings: {
        bank_account: { id: '1', name: 'Fyle' },
        default_ccc_account: { id: '1', name: 'Fyle' },
        accounts_payable: { id: '1', name: 'Fyle' },
        default_ccc_vendor: { id: '1', name: 'Fyle' },
        qbo_expense_account: { id: '1', name: 'Fyle' },
        default_debit_card_account: { id: '1', name: 'Fyle' }
      },
      workspace_id: 1
    };

    const response2: DestinationAttribute[] = [{
      id: 1,
      attribute_type: 'EMPLOYEE',
      display_name: "string",
      value: "string",
      destination_id: "string",
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 2,
      detail: {
        email: 'String',
        fully_qualified_name: 'string'
      }
    },
    {
      id: 1,
      attribute_type: 'VENDOR',
      display_name: "string",
      value: "string",
      destination_id: "string",
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 2,
      detail: {
        email: 'String',
        fully_qualified_name: 'string'
      }
    }];
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
    const req2 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    const req3 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`
    });
    req1.flush(response);
    req2.flush(response1);
    req3.flush(response2);
  });

  it('Navigate function check', () => {
    component.navigateToPreviousStep();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/qbo_connector']);
  });

  it('Save function check', () => {
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.isOnboarding = true;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
      workspace_id: 1
    };
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
    req.flush(response);
  });

  it('Save function check', () => {
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = undefined;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    const response: EmployeeSettingGet = {
      workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
      workspace_id: 1
    };
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
    req.flush(response);
  });

  it('Save function check', () => {
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = undefined;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    const responseKeys = { status: 404, statusText: "Not Found" };
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
    });
    req.flush('', responseKeys);
    fixture.detectChanges();
    expect(component.saveInProgress).toBeFalse();
  });

  it('Save function check', () => {
    component.saveInProgress = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.VENDOR;
    component.isOnboarding = false;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
  });
});
