import { getTestBed, TestBed } from '@angular/core/testing';
import { ExportSettingService } from './export-setting.service';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ExpenseState, CCCExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, ExportDateType, NameInJournalEntry } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ExportSettingService', () => {
  let service: ExportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportSettingService]
    });
    injector = getTestBed();
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

});
