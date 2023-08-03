import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CorporateCreditCardExpensesObject, ExpenseState, CCCExpenseState, ReimbursableExpensesObject, FyleField } from '../enum/enum.model';
import { ExportSettingModel, ExportSettingPost } from "./export-setting.model";

describe('ExportSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntypedFormGroup],
      declarations: [ ExportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ExportSettingModel[]', () => {
    const exportSettingsForm= new UntypedFormGroup({
      expenseState: new UntypedFormControl('PAID'),
      cccExpenseState: new UntypedFormControl('PAID'),
      reimbursableExpense: new UntypedFormControl(true),
      reimbursableExportType: new UntypedFormControl('BILL'),
      reimbursableExportGroup: new UntypedFormControl('sample'),
      reimbursableExportDate: new UntypedFormControl(null),
      creditCardExpense: new UntypedFormControl(true),
      creditCardExportType: new UntypedFormControl('BILL'),
      creditCardExportGroup: new UntypedFormControl('sipper'),
      creditCardExportDate: new UntypedFormControl(null),
      bankAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultCCCAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      accountsPayable: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultCreditCardVendor: new UntypedFormControl({id: '1', name: 'Fyle'}),
      qboExpenseAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      defaultDebitCardAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      nameInJournalEntry: new UntypedFormControl(FyleField.EMPLOYEE),
      searchOption: new UntypedFormControl([])
    });
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        expense_state: ExpenseState.PAID,
        ccc_expense_state: CCCExpenseState.PAID,
        reimbursable_expense_group_fields: ['sample'],
        reimbursable_export_date_type: null,
        corporate_credit_card_expense_group_fields: ['sipper'],
        ccc_export_date_type: null
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL,
        name_in_journal_entry: null
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
