import { getTestBed, TestBed } from '@angular/core/testing';
import { ExportSettingService } from './export-setting.service';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
<<<<<<< HEAD
import { ExpenseState, CCCExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, ExportDateType, ExpenseGroupingFieldOption } from '../../models/enum/enum.model';
=======
import { ExpenseState, CCCExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, ExportDateType, NameInJournalEntry } from '../../models/enum/enum.model';
>>>>>>> 170b61efb196c94831dbcd371e7bd393dcdaa6a9
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { exportResponse } from 'src/app/shared/components/configuration/export-settings/export-settings.fixture';

describe('ExportSettingService', () => {
  let service: ExportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let formbuilder: FormBuilder;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportSettingService]
    });
    injector = getTestBed();
    formbuilder = TestBed.inject(FormBuilder);
    service = injector.inject(ExportSettingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('getExportSettings service check attributes check', () => {
    const response: ExportSettingGet = {
      expense_group_settings: {
        expense_state: ExpenseState.PAID,
        ccc_expense_state: CCCExpenseState.PAID,
        reimbursable_expense_group_fields: ['sample'],
        reimbursable_export_date_type: ExportDateType.APPROVED_AT,
        corporate_credit_card_expense_group_fields: ['sipper'],
        ccc_export_date_type: ExportDateType.SPENT_AT
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL,
<<<<<<< HEAD
        is_simplify_report_closure_enabled: true
=======
        name_in_journal_entry: NameInJournalEntry.EMPLOYEE
>>>>>>> 170b61efb196c94831dbcd371e7bd393dcdaa6a9
      },
      general_mappings: {
        bank_account: { id: '1', name: 'Fyle' },
        default_ccc_account: { id: '1', name: 'Fyle' },
        accounts_payable: { id: '1', name: 'Fyle' },
        default_ccc_vendor: { id: '1', name: 'Fyle' },
        qbo_expense_account: { id: '1', name: 'Fyle' },
        default_debit_card_account: { id: '1', name: 'Fyle' }
      },
      workspace_id: 1
    };
    service.getExportSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req.flush(response);

  });

  it('postEmployeeSettings service check', () => {
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
        name_in_journal_entry: NameInJournalEntry.MERCHANT
      },
      general_mappings: {
        bank_account: { id: '1', name: 'Fyle' },
        default_ccc_account: { id: '1', name: 'Fyle' },
        accounts_payable: { id: '1', name: 'Fyle' },
        default_ccc_vendor: { id: '1', name: 'Fyle' },
        qbo_expense_account: { id: '1', name: 'Fyle' },
        default_debit_card_account: { id: '1', name: 'Fyle' }
      }
    };
    const response={
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
<<<<<<< HEAD
        is_simplify_report_closure_enabled: true
=======
        name_in_journal_entry: NameInJournalEntry.MERCHANT
>>>>>>> 170b61efb196c94831dbcd371e7bd393dcdaa6a9
      },
      general_mappings: {
        bank_account: { id: '1', name: 'Fyle' },
        default_ccc_account: { id: '1', name: 'Fyle' },
        accounts_payable: { id: '1', name: 'Fyle' },
        default_ccc_vendor: { id: '1', name: 'Fyle' },
        qbo_expense_account: { id: '1', name: 'Fyle' },
        default_debit_card_account: { id: '1', name: 'Fyle' }
      },
      workspace_id: 1
    };
    service.postExportSettings(exportSettingPayload).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req.flush(response);

  });

  it('exportSelectionValidator function check', () => {
    const control = { value: ExpenseState.PAID, parent: formbuilder.group({
      reimbursableExpense: ReimbursableExpensesObject.BILL
    }) };
    expect((service as any).exportSelectionValidator()(control as AbstractControl)).toEqual({forbiddenOption: { value: 'PAID' }});
    const control1 = { value: ExpenseState.PAYMENT_PROCESSING, parent: formbuilder.group({
      creditCardExpense: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    }) };
    expect((service as any).exportSelectionValidator()(control1 as AbstractControl)).toEqual({forbiddenOption: { value: 'PAYMENT_PROCESSING' }});
  });

  it('createReimbursableExpenseWatcher function check', () => {
    const form = formbuilder.group({
      reimbursableExpense: false,
      expenseState: ExpenseState.PAID,
      reimbursableExportType: ReimbursableExpensesObject.BILL,
      reimbursableExportDate: ExportDateType.APPROVED_AT,
      reimbursableExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID
    });

    expect((service as any).createReimbursableExpenseWatcher(form, exportResponse)).toBeUndefined();

    form.controls.reimbursableExpense.patchValue(true);
    expect((service as any).createReimbursableExpenseWatcher(form, exportResponse)).toBeUndefined();

    form.controls.reimbursableExpense.patchValue(false);
    expect((service as any).createReimbursableExpenseWatcher(form, exportResponse)).toBeUndefined();
  });

  it('createCreditCardExpenseWatcher function check', () => {
    const form = formbuilder.group({
      creditCardExpense: false,
      cccExpenseState: ExpenseState.PAID,
      creditCardExportType: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE,
      creditCardExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID,
      creditCardExportDate: ExportDateType.POSTED_AT
    });

    expect((service as any).createCreditCardExpenseWatcher(form, exportResponse)).toBeUndefined();

    form.controls.creditCardExpense.patchValue(true);
    expect((service as any).createCreditCardExpenseWatcher(form, exportResponse)).toBeUndefined();

    form.controls.creditCardExpense.patchValue(false);
    expect((service as any).createCreditCardExpenseWatcher(form, exportResponse)).toBeUndefined();
  });

  it('setGeneralMappingsValidator function check', () => {
    const form = formbuilder.group({
      creditCardExpense: false,
      cccExpenseState: ExpenseState.PAID,
      creditCardExportType: CorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE,
      creditCardExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID,
      creditCardExportDate: ExportDateType.POSTED_AT
    });
    form.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
    expect((service as any).setGeneralMappingsValidator()).toBeUndefined();
  });

  it('function check', () => {
    expect((service as any).getExportGroup([ExpenseGroupingFieldOption.EXPENSE_ID])).toEqual('expense_id');
    expect((service as any).getExportGroup(null)).toEqual('');
  });
});
