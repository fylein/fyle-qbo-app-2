import { getTestBed, TestBed } from '@angular/core/testing';
import { ExportSettingService } from './export-setting.service';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ExpenseState, CCCExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, ExportDateType, ExpenseGroupingFieldOption, NameInJournalEntry } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { exportResponse, mockCCCExpenseStateOptions, mockReimbursableExpenseGroupingFieldOptions, mockReimbursableExportTypeOptions } from 'src/app/shared/components/configuration/export-settings/export-settings.fixture';

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
        is_simplify_report_closure_enabled: true,
        name_in_journal_entry: NameInJournalEntry.EMPLOYEE
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
        is_simplify_report_closure_enabled: true,
        name_in_journal_entry: NameInJournalEntry.MERCHANT
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
    const form= new UntypedFormGroup({
      employeeMapping: new UntypedFormControl('EMPLOYEE'),
      autoMapEmployee: new UntypedFormControl('EMPLOYEE_CODE'),
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
      searchOption: new UntypedFormControl([]),
      chartOfAccount: new UntypedFormControl(true),
      chartOfAccountTypes: new UntypedFormControl([{enabled: true, name: 'expence'}]),
      importItems: new UntypedFormControl(true),
      taxCode: new UntypedFormControl(true),
      defaultTaxCode: new UntypedFormControl({id: '1', name: 'Fyle'}),
      importVendorsAsMerchants: new UntypedFormControl(true),
      paymentSync: new UntypedFormControl(true),
      billPaymentAccount: new UntypedFormControl({id: '1', name: 'Fyle'}),
      changeAccountingPeriod: new UntypedFormControl(true),
      singleCreditLineJE: new UntypedFormControl(true),
      autoCreateVendors: new UntypedFormControl(true),
      autoCreateMerchantsAsVendors: new UntypedFormControl(true),
      exportSchedule: new UntypedFormControl(true),
      exportScheduleFrequency: new UntypedFormControl(10),
      memoStructure: new UntypedFormControl(['Fyle']),
      emails: new UntypedFormControl([]),
      addedEmail: new UntypedFormControl([]),
      skipExport: new UntypedFormControl(true)
    });
    form.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
    expect((service as any).setGeneralMappingsValidator(form)).toBeUndefined();
    expect((service as any).showCCCAccountsPayableField(form));

  });

  it('function check', () => {
    expect((service as any).getExportGroup([ExpenseGroupingFieldOption.EXPENSE_ID])).toEqual('expense_id');
    expect((service as any).getExportGroup(null)).toEqual('');

    expect((service as any).getReimbursableExpenseGroupingFieldOptions());
    expect((service as any).getReimbursableExportTypeOptions());
    expect((service as any).getcreditCardExportTypes());
    expect((service as any).getReimbursableExpenseGroupingDateOptions());
    expect((service as any).getReimbursableExpenseStateOptions());
    expect((service as any).getCCCExpenseStateOptions());
    expect((service as any).nameInJournalOptions());
  });
});
