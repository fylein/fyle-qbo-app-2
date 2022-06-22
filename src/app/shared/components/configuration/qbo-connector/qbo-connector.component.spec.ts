import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QboConnectorComponent } from './qbo-connector.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { ExportSettingGet } from 'src/app/core/models/configuration/export-setting.model';
import { ExpenseState, ExportDateType, ReimbursableExpensesObject, CorporateCreditCardExpensesObject } from 'src/app/core/models/enum/enum.model';

describe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;
  let router: Router;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let req: any;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({ org_id: 'dummy' }));
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule, MatSnackBarModule],
      declarations: [QboConnectorComponent],
      providers: [QboConnectorService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboConnectorComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create, export ervice fails', () => {
    expect(component).toBeTruthy();
    const response = {
      id: 1,
      refresh_token: 'fyle',
      is_expired: false,
      realm_id: 'realmId',
      country: 'india',
      company_name: 'Fyle',
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id
    };
    req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
    const response1={status: 404, statusText: "Not Found"};
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req1.flush(response1);
    expect(component.isLoading).toBeFalse();
    expect(component.showDisconnectQBO).toBeTrue();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const response = {
      id: 1,
      refresh_token: 'fyle',
      is_expired: false,
      realm_id: 'realmId',
      country: 'india',
      company_name: 'Fyle',
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id
    };
    req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
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
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req1.flush(response1);
    expect(component.isLoading).toBeFalse();
    expect(component.isContinueDisabled).toBeFalse();
  });

  it('should create in failure', () => {
    expect(component).toBeTruthy();
    const response = {
      status: 404, statusText: "Not Found", error: { id: '2', is_expired: false, company_name: 'QBO-Fyle' }
    };
    req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.isQboConnected).toBeFalsy();
    expect(component.isContinueDisabled).toBeTrue();
  });

  it('continueToNextStep=> isContinueDisabled = false function check', () => {
    spyOn(router, 'navigate');
    component.isContinueDisabled = false;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/employee_settings`]);
  });

  it('continueToNextStep => isContinueDisabled = true function check', () => {
    component.isContinueDisabled = true;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
  });

  it('disconnectQBO function check', () => {
    component.qboCompanyName = 'QBO-Fyle';
    fixture.detectChanges();
    expect(component.disconnectQbo()).toBeUndefined();
    const response = {
      id: 1,
      refresh_token: 'fyle',
      is_expired: false,
      realm_id: 'realmId',
      country: 'india',
      company_name: 'Fyle',
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id
    };
    req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/qbo/`
    });
    req.flush(response);
  });
});
