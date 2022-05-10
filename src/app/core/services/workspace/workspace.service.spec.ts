import { getTestBed, TestBed } from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';
import { Workspace } from '../../models/db/workspace.model';
import { EmployeeFieldMapping, OnboardingState } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkspaceGeneralSetting } from '../../models/db/workspace-general-setting.model';
import { environment } from 'src/environments/environment';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url
  const workspace_id = environment.tests.workspaceId
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkspaceService]
    });
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getWorkspaceid service', () => {
    const id = service.getWorkspaceId();
    const org = workspace_id;
    expect(id.toString()).toEqual(org);
  });
  it('getFyleCurrency service', () => {
    const id = service.getFyleCurrency();
    const org = '';
    expect(id).toBeNull()
  });

  it('setOnboardingState and getOnboardingState service', () => {
    service.setOnboardingState(OnboardingState.COMPLETE);
    const state = 'COMPLETE';
    const response = service.getOnboardingState()
    expect(state).toEqual(response);
  });

  it('createWorkspace service', () => {
    const responseKeys:Workspace = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      fyle_currency:"ING",
      qbo_realm_id: "",
      cluster_domain: "",
      onboarding_state: OnboardingState.CONNECTION,
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z") ,
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
    }
    service.createWorkspace().subscribe((value) => {
      expect(value).toEqual(responseKeys);
    })
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`,
    });
  req.flush(responseKeys);
  });

  it('getWorkspace details service', () => {
    const responseKeys:Workspace[] = [{
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      fyle_currency:"ING",
      qbo_realm_id: "",
      cluster_domain: "",
      onboarding_state: OnboardingState.CONNECTION,
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z") ,
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
    }];
    service.getWorkspaces('1').subscribe(value => {
      expect(value).toEqual(responseKeys);
    })
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`,
    });
  req.flush(responseKeys);
  });

  it('WorkspacegeneralSetting service', () => {
    const response:WorkspaceGeneralSetting = {
      auto_create_destination_entity: true,
      auto_map_employees: null,
      category_sync_version: "v1",
      change_accounting_period: true,
      charts_of_accounts: ['Expense'],
      corporate_credit_card_expenses_object: null,
      created_at: new Date("2022-04-27T11:07:17.694377Z"),
      employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
      id: 1,
      import_categories: false,
      import_projects: false,
      import_tax_codes: false,
      import_vendors_as_merchants: false,
      je_single_credit_line: true,
      map_fyle_cards_qbo_account: true,
      map_merchant_to_vendor: false,
      memo_structure: ['Fyle'],
      reimbursable_expenses_object: null,
      skip_cards_mapping: false,
      sync_fyle_to_qbo_payments: false,
      sync_qbo_to_fyle_payments: false,
      updated_at: new Date("2022-04-28T12:48:39.150177Z"),
      workspace: 1
    };
    service.getWorkspaceGeneralSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/settings/general/`,
    });
  req.flush(response);
  });

  it('syncFyleDimensions service', () => {
    expect(service.syncFyleDimensions()).toBeTruthy();
  });

  it('syncQBODimensions service', () => {
    expect(service.syncQBODimensions()).toBeTruthy();
  });

  it('refreshFyleDimensions service', () => {
    expect(service.refreshFyleDimensions()).toBeTruthy();
  });

  it('refreshQBODimensions service', () => {
    expect(service.refreshQBODimensions()).toBeTruthy();
  });
});
