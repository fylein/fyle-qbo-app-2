import { getTestBed, TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseGroupResponse } from '../../models/db/expense-group.model';
import { ExpenseState, ExportDateType } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ExportLogService', () => {
  let service: ExportLogService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  
  beforeEach(() => {
    // TODO: remove this temp hack
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportLogService]
    });
    injector = getTestBed();
    service = injector.inject(ExportLogService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getExpenseGroupSettings service', () => {
    const response:ExpenseGroupSetting = {
      ccc_export_date_type: ExportDateType.CURRENT_DATE,
      corporate_credit_card_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      created_at: new Date("2022-04-13T10:29:18.802702Z"),
      expense_state: ExpenseState.PAYMENT_PROCESSING,
      id: 1,
      import_card_credits: false,
      reimbursable_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
      updated_at: new Date("2022-04-13T10:29:18.802749Z"),
      workspace: 1
    };
    
    service.getExpenseGroupSettings().subscribe(result => {
      expect(result).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_group_settings/`,
    });
      req.flush(response);
  });

  it('getExpenseGroups service', () => {
    const response: ExpenseGroupResponse= {
      count: 0,
      next: 'null',
      previous: "xxx",
      results: []
    };
    service.getExpenseGroups('COMPLETE', 10, 5, null, ).subscribe(result => {
      expect(result).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/?limit=10&offset=5&state=COMPLETE`,
    });
      req.flush(response);
  });
});
