import { getTestBed, TestBed } from '@angular/core/testing';
import { AdvancedSettingService } from './advanced-setting.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'src/environments/environment';
import { WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { ExpenseFilterResponse, SkipExport } from '../../models/misc/skip-export.model';
import { JoinOption, Operator } from '../../models/enum/enum.model';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormBuilder } from '@angular/forms';
import { paymentSyncOptions } from 'src/app/shared/components/configuration/advanced-settings/advanced-settings.fixture';
import { of } from 'rxjs';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({hours: 1,
    schedule_enabled: true,
    emails_selected: ["fyle@fyle.in"],
    email_added: {name: "fyle", email: 'fyle@fyle.in'}}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, NoopAnimationsModule],
      providers: [AdvancedSettingService]
    });
    injector = getTestBed();
    formbuilder = TestBed.inject(FormBuilder);
    service = injector.inject(AdvancedSettingService);
    httpMock = injector.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAdvancedSettings service check', () => {
    const advancedSettingResponse:AdvancedSettingGet = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: true,
        auto_create_merchants_as_vendors: true,
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        emails_selected: [],
        additional_email_options: []
      },
      workspace_id: 1
    };
    service.getAdvancedSettings().subscribe((value) => {
      expect(value).toEqual(advancedSettingResponse);
    });
    const req = httpMock.expectOne({
	      method: 'GET',
	      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/advanced_configurations/`
	    });
    req.flush(advancedSettingResponse);
  });

  it('postAdvancedSettings service check', () => {
    const advancedSettingPayload: AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: true,
        auto_create_merchants_as_vendors: true,
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        emails_selected: [],
        additional_email_options: []
      }
    };

    const advancedSettingResponse:AdvancedSettingGet = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: true,
        auto_create_merchants_as_vendors: true,
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        emails_selected: [],
        additional_email_options: []
      },
      workspace_id: 1
    };
    service.postAdvancedSettings(advancedSettingPayload).subscribe(value => {
      expect(value).toEqual(advancedSettingResponse);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/advanced_configurations/`
    });
  req.flush(advancedSettingResponse);
  });

  it('getWorkspaceAdmins function check', () => {
    const response: WorkspaceScheduleEmailOptions[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];
    service.getWorkspaceAdmins().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/admins/`
    });
  req.flush(response);

  });

  it('getExpenseFilter function check', () => {
    const response: ExpenseFilterResponse = {
      count: 1,
      results: [
        {
          condition: 'employee_email',
          custom_field_type: null,
          operator: Operator.IExact,
          values: ['anish@email.com', 'ashwin@fyle.in'],
          rank: 1,
          is_custom: false,
          join_by: null
        }
      ]
    };
    service.getExpenseFilter().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_filters/`
    });
    req.flush(response);
  });

  it('postExpenseFilter function check', () => {
    const response: SkipExport = {
      condition: 'employee_email',
      custom_field_type: null,
      operator: Operator.IExact,
      values: ['anish@email.com', 'ashwin@fyle.in'],
      rank: 1,
      join_by: null,
      is_custom: false
    };
    const data = {
      condition: 'string',
      custom_field_type: 'any',
      operator: Operator.IsNull,
      values: [],
      rank: 1,
      join_by: JoinOption.AND,
      is_custom: true
    };
    service.postExpenseFilter(data).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_filters/`
    });
    req.flush(response);
  });

  it('deleteExpenseFilter function check', () => {
    const response: SkipExport = {
      condition: 'employee_email',
      custom_field_type: null,
      operator: Operator.IExact,
      values: ['anish@email.com', 'ashwin@fyle.in'],
      rank: 1,
      join_by: null,
      is_custom: false
    };
    service.deleteExpenseFilter(1).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_filters/1/`
    });
    req.flush(response);
  });

  it('getPaymentSyncOptions function check', () => {
    const value = service.getPaymentSyncOptions();
    expect(value).toEqual(paymentSyncOptions);
  });

  it('getFrequencyIntervals function check', () => {
    service.getFrequencyIntervals();
  });

  it('openAddemailDialog function check', () => {
    const form = formbuilder.group({
      exportScheduleFrequency: 12,
      emails: ['test@test.com'],
      exportSchedule: true,
      addedEmail: []
    });
    expect((service as any).openAddemailDialog(form, [])).toBeUndefined();
  });
});
