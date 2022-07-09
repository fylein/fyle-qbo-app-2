import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { DashboardComponent } from './dashboard.component';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { workspaceGeneralSettingResponse, errorResponse, expenseGroupSettingResponse, user, getExportErrorsData, getLastExportResponse, allTasksResponse, getExportableGroupsIdsResponse, expenseGroupSettingResponse1 } from 'src/app/integration/main/dashboard/dashboard.fixture';
import { DashboardModule } from './dashboard.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorType, ExportState, TaskLogState } from 'src/app/core/models/enum/enum.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let workspace: WorkspaceService;
  let dashboard: DashboardService;
  let userService: UserService;
  let exportLogService: ExportLogService;
  let formBuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const workspaceId = environment.tests.workspaceId;
  beforeEach(async () => {
    const service1 = {
      getExpenseGroupSettings: () => of(expenseGroupSettingResponse)
    };
    const service2 = {
      getUserProfile: () => of(user)
    };
    const service3 = {
      getWorkspaceGeneralSettings: () => of(workspaceGeneralSettingResponse),
      getWorkspaceId: () => workspaceId
    };
    const service4 = {
      getExportErrors: () => of(getExportErrorsData),
      getLastExport: () => of(getLastExportResponse),
      getAllTasks: () => of(allTasksResponse),
      importExpenseGroups: () => of({}),
      getExportableGroupsIds: () => of(getExportableGroupsIdsResponse),
      exportExpenseGroups: () => of({})
    };
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatDialogModule, NoopAnimationsModule, DashboardModule, MatSnackBarModule ],
      declarations: [ DashboardComponent ],
      providers: [
        { provide: WorkspaceService, useValue: service3 },
        { provide: UserService, useValue: service2 },
        { provide: ExportLogService, useValue: service1 },
        { provide: DashboardService, useValue: service4 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    workspace = TestBed.inject(WorkspaceService);
    userService = TestBed.inject(UserService);
    exportLogService = TestBed.inject(ExportLogService);
    dashboard = TestBed.inject(DashboardService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    allTasksResponse.results[0].status = TaskLogState.COMPLETED;
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.exportableExpenseGroupIds).toEqual([1, 2, 4]);
  });

  it('should create', () => {
    spyOn(dashboard, 'getLastExport').and.returnValue(throwError(errorResponse));
    expect(component).toBeTruthy();
    fixture.detectChanges();
    // Expect(dashboard.getLastExport).toHaveBeenCalled();
  });

  it('export function check', () => {
    component.exportInProgress = false;
    component.exportableExpenseGroupIds = [1, 2, 4];
    fixture.detectChanges();
    expect(component.export()).toBeUndefined();
  });

  it('showDashboardQboErro function check', () => {
    expect(component.showDashboardQboError(getExportErrorsData[0])).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('showDashboardExportLog function check', () => {
    expect(component.showDashboardExportLog(ExportState.SUCCESS)).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
    expect(component.showDashboardExportLog(ExportState.FAILED)).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('resolveMappingError function check', () => {
    expect(component.resolveMappingError(getExportErrorsData)).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
    getExportErrorsData[0].type = ErrorType.EMPLOYEE_MAPPING;
    expect(component.resolveMappingError(getExportErrorsData)).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
    getExportErrorsData[0].type = ErrorType.TAX_MAPPING;
    expect(component.resolveMappingError(getExportErrorsData)).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('getExpenseGroupingSetting function check', () => {
    expenseGroupSettingResponse.reimbursable_expense_group_fields = ["employee_email", "report_id", "expense_id", "fund_source"];
    expect((component as any).getExpenseGroupingSetting(expenseGroupSettingResponse)).toEqual('expense');
    expenseGroupSettingResponse.reimbursable_expense_group_fields= ["employee_email", "claim_number", "fund_source"],
    expect((component as any).getExpenseGroupingSetting(expenseGroupSettingResponse)).toEqual('');
    expenseGroupSettingResponse.reimbursable_expense_group_fields= ["employee_email", "settlement_id", "fund_source"],
    expect((component as any).getExpenseGroupingSetting(expenseGroupSettingResponse)).toEqual('payment');
    expect((component as any).getExpenseGroupingSetting(expenseGroupSettingResponse1)).toEqual('expense');
  });

  it("pollExportStatus function check", fakeAsync(() => {
    allTasksResponse.count = 0;
    const result = (component as any).pollExportStatus([1, 2, 4]);
    tick(3002);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(result).toBeUndefined();
      expect(component.isLoading).toBeFalse();
    });
    flush();
  }));

  it('trackTimeTakenForResolvingMappingErrors function check', () => {
    component.groupedErrorStat[ErrorType.CATEGORY_MAPPING] = {
      resolvedCount: 1,
      totalCount: 3
    };
    expect((component as any).trackTimeTakenForResolvingMappingErrors(new Date(), ErrorType.CATEGORY_MAPPING)).toBeUndefined();
  });
});
