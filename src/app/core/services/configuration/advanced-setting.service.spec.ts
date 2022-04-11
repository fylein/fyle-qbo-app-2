import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AdvancedSettingService } from './advanced-setting.service';
import { AdvancedSettingModel, AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAdvancedSettings service check', () => {
    expect(service.getAdvancedSettings()).toBeTruthy()
  })

  it('postAdvancedSettings service check', () => {
    const advancedSettingPayload:AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: true,
        je_single_credit_line: true,
        change_accounting_period: true,
        memo_structure: ['Fyle']
      },
      general_mappings: {
        bill_payment_account: {id:'1',name:'Fyle'}
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10
      }
    };
    expect(service.postAdvancedSettings(advancedSettingPayload)).toBeTruthy()
  })
});
