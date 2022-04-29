import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';

describe('ExportLogService', () => {
  let service: ExportLogService;

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
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExpenseGroupSettings service', () => {
    const response = {
      ccc_export_date_type: "current_date",
      corporate_credit_card_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      created_at: "2022-04-13T10:29:18.802702Z",
      expense_state: "PAYMENT_PROCESSING",
      id: 1,
      import_card_credits: false,
      reimbursable_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      reimbursable_export_date_type: "current_date",
      updated_at: "2022-04-13T10:29:18.802749Z",
      workspace: 1
    };
    service.getExpenseGroupSettings().subscribe(result => {
      const responseKeys = Object.keys(response).sort();
      const keys = Object.keys(result).sort();
      expect(keys).toEqual(responseKeys);
    });
  });

  it('getExpenseGroups service', () => {
    const response = {
      count: 0,
      next: null,
      previous: "xxx",
      results: []
    };
    service.getExpenseGroups('COMPLETE', 10, 5).subscribe(result => {
      const responseKeys = Object.keys(response).sort();
      const keys = Object.keys(result).sort();
      expect(keys).toEqual(responseKeys);
    })
  });
});
