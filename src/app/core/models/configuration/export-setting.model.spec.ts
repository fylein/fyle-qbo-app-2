import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CorporateCreditCardExpensesObject, ExpenseState, cccExpenseState, ReimbursableExpensesObject } from '../enum/enum.model';
import { ExportSettingModel, ExportSettingPost } from "./export-setting.model";

describe('ExportSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ ExportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ExportSettingModel[]', () => {
    const exportSettingsForm= new FormGroup({
      expenseState: new FormControl('PAID'),
      cccExpenseState: new FormControl('PAID'),
      reimbursableExpense: new FormControl(true),
      reimbursableExportType: new FormControl('BILL'),
      reimbursableExportGroup: new FormControl('sample'),
      reimbursableExportDate: new FormControl(null),
      creditCardExpense: new FormControl(true),
      creditCardExportType: new FormControl('BILL'),
      creditCardExportGroup: new FormControl('sipper'),
      creditCardExportDate: new FormControl(null),
      bankAccount: new FormControl({id: '1', name: 'Fyle'}),
      defaultCCCAccount: new FormControl({id: '1', name: 'Fyle'}),
      accountsPayable: new FormControl({id: '1', name: 'Fyle'}),
      defaultCreditCardVendor: new FormControl({id: '1', name: 'Fyle'}),
      qboExpenseAccount: new FormControl({id: '1', name: 'Fyle'}),
      defaultDebitCardAccount: new FormControl({id: '1', name: 'Fyle'}),
      searchOption: new FormControl([])
    });
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        expense_state: ExpenseState.PAID,
        ccc_expense_state: cccExpenseState.PAID,
        reimbursable_expense_group_fields: ['sample'],
        reimbursable_export_date_type: null,
        corporate_credit_card_expense_group_fields: ['sipper'],
        ccc_export_date_type: null
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL,
        is_simplify_report_closure_enabled: true
      },
      general_mappings: {
        bank_account: {id: '1', name: 'Fyle'},
        default_ccc_account: {id: '1', name: 'Fyle'},
        accounts_payable: {id: '1', name: 'Fyle'},
        default_ccc_vendor: {id: '1', name: 'Fyle'},
        qbo_expense_account: {id: '1', name: 'Fyle'},
        default_debit_card_account: {id: '1', name: 'Fyle'}
      }
    };
    expect(ExportSettingModel.constructPayload(exportSettingsForm)).toEqual(exportSettingPayload);
  });
});
