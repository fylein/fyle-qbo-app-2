import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { WorkspaceService } from './workspace.service';
import { Workspace } from '../../models/db/workspace.model';
import { OnboardingState } from '../../models/enum/enum.model';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

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
    service = TestBed.inject(WorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWorkspaceid service', () => {
    const id = service.getWorkspaceId();
    const org = "1";
    expect(id.toString()).toEqual(org);
  });

  it('createWorkspace service', () => {
    const responseKeys:Workspace = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
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
  });

  it('getWorkspace details service', () => {
    expect(service.getWorkspaces('1')).toBeTruthy();
  });

  it('WorkspacegeneralSetting service', () => {
    const response = {
      auto_create_destination_entity: true,
      auto_map_employees: null,
      category_sync_version: "v1",
      change_accounting_period: true,
      charts_of_accounts: ['Expense'],
      corporate_credit_card_expenses_object: null,
      created_at: "2022-04-27T11:07:17.694377Z",
      employee_field_mapping: "",
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
      updated_at: "2022-04-28T12:48:39.150177Z",
      workspace: 1
    };
    const responseKeys = Object.keys(response).sort();
    service.getWorkspaceGeneralSettings().subscribe((value) => {
      const keys = Object.keys(value).sort();
      expect(keys).toEqual(responseKeys);
    });
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
