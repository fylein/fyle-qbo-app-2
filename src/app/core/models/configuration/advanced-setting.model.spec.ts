import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup} from '@angular/forms';
import { AdvancedSettingModel} from "./advanced-setting.model";

describe('AdvancedSettingModel', () => {
  let component: AdvancedSettingModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ AdvancedSettingModel ]
    })
    .compileComponents();
  });

  it('Should return AdvancedSettingModel[]', () => {
    let advancedSettingsForm= new FormGroup({
      paymentSync: new FormControl([true]),
      billPaymentAccount: new FormControl([1]),
      changeAccountingPeriod: new FormControl([10]),
      singleCreditLineJE: new FormControl([2]),
      autoCreateVendors: new FormControl(['dhaarani']),
      exportSchedule: new FormControl([true]),
      exportScheduleFrequency: new FormControl([null]),
      memoStructure: new FormControl(["sss"]),
      searchOption: new FormControl([])
    })

    const advancedSettingPayload = {
      workspace_general_settings: {
        sync_fyle_to_qbo_payments: false,
        sync_qbo_to_fyle_payments: false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        je_single_credit_line: advancedSettingsForm.get('singleCreditLineJE')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        memo_structure: advancedSettingsForm.get('memoStructure')?.value
      },
      general_mappings: {
        bill_payment_account: advancedSettingsForm.get('billPaymentAccount')?.value
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null
      }
    };
    expect(AdvancedSettingModel.constructPayload(advancedSettingsForm)).toEqual(advancedSettingPayload);
  });
  });