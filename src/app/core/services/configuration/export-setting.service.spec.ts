import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { ExportSettingService } from './export-setting.service';
import { ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject } from '../../models/enum/enum.model';
import { or } from '@rxweb/reactive-form-validators';

describe('ExportSettingService', () => {
  let service: ExportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
        JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(ExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('getExportSettings service check', () => {
    expect(service.getExportSettings()).toBeTruthy();
  })

  it('getExportSettings service check attributes check', () => {
    let keys: string[] = [];
    const responseKeys = ['expense_group_settings', 'general_mappings', 'workspace_general_settings', 'workspace_id'].sort();
    service.getExportSettings().subscribe((value) => {
      for (let key of Object.keys(value)) {
        keys.push(key);
      }
      keys = keys.sort();
      expect(keys).toEqual(responseKeys);
    })

  })

  it('postEmployeeSettings service check', () => {
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        expense_state: ExpenseState.PAID,
        reimbursable_expense_group_fields: ['sample'],
        reimbursable_export_date_type: null,
        corporate_credit_card_expense_group_fields: ['sipper'],
        ccc_export_date_type: null
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL
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
    expect(service.postExportSettings(exportSettingPayload)).toBeTruthy()
  })

});
