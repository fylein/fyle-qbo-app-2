import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { AdvancedSettingService } from './advanced-setting.service';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'environment.localhost';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;

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
    service = TestBed.inject(AdvancedSettingService);
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    localStorage.setItem('user', environment.tests.user)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAdvancedSettings service working check', () => {
    expect(service.getAdvancedSettings()).toBeTruthy();
  })

  it('getAdvancedSettings service check', () => {
    const responseKeys = ['workspace_general_settings', 'general_mappings', 'workspace_schedules', 'workspace_id'].sort();
    service.getAdvancedSettings().subscribe((value) => {
      const keys = Object.keys(value).sort();
      expect(keys).toEqual(responseKeys);
    })
  })

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

    const advancedSettingResponse = {
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
      const keys = Object.keys(value).sort();
      const responseKeys = Object.keys(advancedSettingResponse).sort();
      expect(keys).toEqual(responseKeys);
    }, error => {
      expect(error).toBeTruthy();
    })
  })
});
