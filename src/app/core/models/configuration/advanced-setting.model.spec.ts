import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { AdvancedSettingModel, AdvancedSettingPost} from "./advanced-setting.model";

describe('AdvancedSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntypedFormGroup],
      declarations: [ AdvancedSettingModel ]
    })
    .compileComponents();
  });

  it('Should return AdvancedSettingModel[]', () => {
    const advancedSettingsForm= new UntypedFormGroup({
      paymentSync: new UntypedFormControl(true),
      billPaymentAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      changeAccountingPeriod: new UntypedFormControl(true),
      singleCreditLineJE: new UntypedFormControl(true),
      autoCreateVendors: new UntypedFormControl(true),
      autoCreateMerchantsAsVendors: new UntypedFormControl(true),
      exportSchedule: new UntypedFormControl(true),
      exportScheduleFrequency: new UntypedFormControl(10),
      memoStructure: new UntypedFormControl(['Fyle']),
      searchOption: new UntypedFormControl([]),
      emails: new UntypedFormControl([]),
      addedEmail: new UntypedFormControl([]),
      skipExport: new UntypedFormControl(true)
    });

    const advancedSettingPayload:AdvancedSettingPost = {
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
        bill_payment_account: {id: '1', name: 'Fyle'}
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        emails_selected: [],
        additional_email_options: []
      }
    };
    expect(AdvancedSettingModel.constructPayload(advancedSettingsForm)).toEqual(advancedSettingPayload);
    });
  });
