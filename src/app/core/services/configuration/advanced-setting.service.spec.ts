import { getTestBed, TestBed } from '@angular/core/testing';
import { AdvancedSettingService } from './advanced-setting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedSettingGet, AdvancedSettingPost, AdvancedSettingWorkspaceSchedulePost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'src/environments/environment';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdvancedSettingService]
    });
    injector = getTestBed();
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
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10
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
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10
      }
    };

    const advancedSettingResponse:AdvancedSettingGet = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: true,
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10
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

  it('postWorkspaceSchedule function check', () => {
    const response: WorkspaceSchedule = {
      id: 1,
      workspace: 1,
      enabled: false,
      start_datetime: new Date(),
      interval_hours: 1,
      schedule: 1,
      emails_selected: ['fyle@fyle.in'],
      additional_email_options: [{name: 'fyle', email: 'fyle@fyle.in'}]
  };
  const payloade: AdvancedSettingWorkspaceSchedulePost = {
    hours: 1,
    schedulEnabled: false,
    addedEmail: {name: 'fyle', email: 'fyle@fyle.in'},
    selectedEmails: []
  };
    service.postWorkspaceSchedule(payloade).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/schedule/`
    });
    req.flush(response);
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

  it('getWorkspaceSchedule function check', () => {
    const response: WorkspaceSchedule = {
      id: 1,
      workspace: 1,
      enabled: false,
      start_datetime: new Date(),
      interval_hours: 1,
      schedule: 1,
      emails_selected: ['fyle@fyle.in'],
      additional_email_options: [{name: 'fyle', email: 'fyle@fyle.in'}]
  };
    service.getWorkspaceSchedule().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/schedule/`
    });
  req.flush(response);

  });
});
