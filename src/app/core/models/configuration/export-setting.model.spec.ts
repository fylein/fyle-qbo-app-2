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
    const exportSettingPayload = {
      expense_group_settings: {
        expense_state: exportSettingsForm.get('expenseState')?.value,
        reimbursable_expense_group_fields: [exportSettingsForm.get('reimbursableExportGroup')?.value],
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
        corporate_credit_card_expense_group_fields: [exportSettingsForm.get('creditCardExportGroup')?.value],
        ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ,
        default_ccc_account: exportSettingsForm.get('defaultCCCAccount')?.value ,
        accounts_payable: exportSettingsForm.get('accountsPayable')?.value ,
        default_ccc_vendor: exportSettingsForm.get('defaultCreditCardVendor')?.value ,
        qbo_expense_account: exportSettingsForm.get('qboExpenseAccount')?.value ,
        default_debit_card_account: exportSettingsForm.get('defaultDebitCardAccount')?.value
      }
    };
    expect(ExportSettingModel.constructPayload(exportSettingsForm)).toEqual(exportSettingPayload);
  });
  });