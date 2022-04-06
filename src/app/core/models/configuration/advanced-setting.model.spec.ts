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
      exportSchedule: new FormControl([false]),
      exportScheduleFrequency: new FormControl([null]),
      memoStructure: new FormControl(["sss"]),
      searchOption: new FormControl([])
    })
    expect(AdvancedSettingModel.constructPayload(advancedSettingsForm)).toBeTruthy();
  });
  });