import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ExportSettingModel } from "./export-setting.model";

describe('ExportSettingModel', () => {
  let component: ExportSettingModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ ExportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ExportSettingModel[]', () => {
    let exportSettingsForm= new FormGroup({
      expenseState: new FormControl(['sample']),
      reimbursableExpense: new FormControl([true]),
      reimbursableExportType: new FormControl(['sample']),
      reimbursableExportGroup: new FormControl(['sample']),
      reimbursableExportDate: new FormControl(['sample']),
      creditCardExpense: new FormControl([true]),
      creditCardExportType: new FormControl(['sample']),
      creditCardExportGroup: new FormControl(['sipper']),
      creditCardExportDate: new FormControl(['supper']),
      bankAccount: new FormControl([null]),
      defaultCCCAccount: new FormControl([null]),
      accountsPayable: new FormControl([null]),
      defaultCreditCardVendor: new FormControl([null]),
      qboExpenseAccount: new FormControl([null]),
      defaultDebitCardAccount: new FormControl([null]),
      searchOption: new FormControl([])
    })
    
    expect(ExportSettingModel.constructPayload(exportSettingsForm)).toBeTruthy();
  });
  });