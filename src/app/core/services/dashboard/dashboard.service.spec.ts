import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportableExpenseGroup } from '../../models/db/expense-group.model';
import { LastExport } from '../../models/db/last-export.model';
import { TaskResponse } from '../../models/db/task-log.model';
import { ExportMode, TaskLogState, TaskLogType } from '../../models/enum/enum.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    injector = getTestBed();
    service = injector.inject(DashboardService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExportableGroupsIds() service check', () => {
    const response:ExportableExpenseGroup = {exportable_expense_group_ids: []};
    service.getExportableGroupsIds().subscribe((value) => {

      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/exportable_expense_groups/`
    });
  req.flush(response);
  });

  it('getExportErrors() service check', () => {
    service.getExportErrors().subscribe((value) => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/errors/?is_resolved=false`
    });
    req.flush([]);
  });

  it('importExpenseGroups() service check', () => {
    service.importExpenseGroups().subscribe((value) => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/sync/`
    });
    req.flush({});
  });

  it('exportExpenseGroups() service check', () => {
    service.exportExpenseGroups().subscribe((value) => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/exports/trigger/`
    });
    req.flush({});
  });

  it('getLastExport() service check', () => {
    const response:LastExport={
      created_at: new Date("2022-04-27T06:37:30.296865Z"),
      export_mode: ExportMode.MANUAL,
      failed_expense_groups_count: 5,
      id: 154,
      last_exported_at: new Date("2022-05-10T08:00:38.440819Z"),
      successful_expense_groups_count: 0,
      total_expense_groups_count: 5,
      updated_at: new Date("2022-05-10T08:00:43.857641Z"),
      workspace: 216
    };
    service.getLastExport().subscribe((value) => {
      const keys = Object.keys(value).sort();
      const responseKeys = Object.keys(response).sort();
      expect(keys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_detail/`
    });
    req.flush(response);
  });


  it('getTasks() service check', () => {
    const response:TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
    const taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];
    service.getTasks(500, [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS], [], taskType, null).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500&offset=0&status=ENQUEUED,IN_PROGRESS&task_type=FETCHING_EXPENSE,CREATING_BILL,CREATING_EXPENSE,CREATING_CHECK,CREATING_CREDIT_CARD_PURCHASE,CREATING_JOURNAL_ENTRY,CREATING_CREDIT_CARD_CREDIT,CREATING_DEBIT_CARD_EXPENSE`
    });
    req.flush(response);
  });

  it('getTasks() service number check', () => {
    const response:TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
    const taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];
    service.getTasks(500, [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS], [3], taskType, null).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500&offset=0&status=ENQUEUED,IN_PROGRESS&expense_group_ids=3&task_type=FETCHING_EXPENSE,CREATING_BILL,CREATING_EXPENSE,CREATING_CHECK,CREATING_CREDIT_CARD_PURCHASE,CREATING_JOURNAL_ENTRY,CREATING_CREDIT_CARD_CREDIT,CREATING_DEBIT_CARD_EXPENSE`
    });
    req.flush(response);
  });

  it('getTasks() service number check', () => {
    const response:TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
    const taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];
    service.getTasks(500, [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS], [3], taskType, `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500`).subscribe((value) => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
      const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500`)
    );
    expect(req.request.params.get('limit')).toBeNull();
    req.flush(response);
  });

  it('getAllTask() service check', () => {
    const taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];
    const response:TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
    let responseKeys;
    let actualKeys;
    service.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], [3], taskType).subscribe(value => {
      responseKeys = Object.keys(response).sort();
      actualKeys = Object.keys(value).sort();
    });
    expect(responseKeys).toEqual(actualKeys);
    expect(response).toBeTruthy();
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500&offset=0&status=ENQUEUED,IN_PROGRESS,FAILED&expense_group_ids=3&task_type=FETCHING_EXPENSE,CREATING_BILL,CREATING_EXPENSE,CREATING_CHECK,CREATING_CREDIT_CARD_PURCHASE,CREATING_JOURNAL_ENTRY,CREATING_CREDIT_CARD_CREDIT,CREATING_DEBIT_CARD_EXPENSE`
    });
    req.flush(response);
  });


  it('getAllTasksInternal function check', () => {
    const taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];
    const task = [{
      bill: 1,
      cheque: 1,
      created_at: new Date(),
      credit_card_purchase: 1,
      // Having any here is okay, didn't differentiate qbo errors and fyle errors
      detail: "any",
      quickbooks_errors: [],
      expense_group: 1,
      id: 1,
      journal_entry: 1,
      bill_payment: 1,
      status: TaskLogState.COMPLETED,
      task_id: "string",
      type: TaskLogType.CREATING_BILL,
      updated_at: new Date(),
      workspace: 1
    }];
    const allTasks: TaskResponse = {
      count: 3,
      next: null,
      previous: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500`,
      results: task
    };
    const response1:TaskResponse = {
      count: 0,
      next: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500`,
      previous: null,
      results: []
    };
    const response = (service as any).getAllTasksInternal(500, [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], [3], taskType, allTasks);
    expect(response).toBeTruthy();
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/tasks/all/?limit=500&offset=0&status=ENQUEUED,IN_PROGRESS,FAILED&expense_group_ids=3&task_type=FETCHING_EXPENSE,CREATING_BILL,CREATING_EXPENSE,CREATING_CHECK,CREATING_CREDIT_CARD_PURCHASE,CREATING_JOURNAL_ENTRY,CREATING_CREDIT_CARD_CREDIT,CREATING_DEBIT_CARD_EXPENSE`
    });
    req.flush(response1);
  });
});


