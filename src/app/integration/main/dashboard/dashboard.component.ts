import { Component, OnInit } from '@angular/core';
import { forkJoin, from, interval, Observable, of } from 'rxjs';
import { catchError, map, switchMap, takeWhile } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Error, GroupedErrors, GroupedErrorStat } from 'src/app/core/models/db/error.model';
import { LastExport } from 'src/app/core/models/db/last-export.model';
import { ClickEvent, EmployeeFieldMapping, ErrorType, ExportState, FyleField, FyleReferenceType, QBOField, RefinerSurveyType, TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { DashboardResolveMappingErrorDialogComponent } from 'src/app/shared/components/dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping-error-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { DashboardExportLogDialogComponent } from 'src/app/shared/components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardQboErrorDialogComponent } from 'src/app/shared/components/dashboard/dashboard-qbo-error-dialog/dashboard-qbo-error-dialog.component';
import { Task } from 'src/app/core/models/db/task-log.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportableExpenseGroup } from 'src/app/core/models/db/expense-group.model';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { ExpenseGroupSetting } from 'src/app/core/models/db/expense-group-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ResolveMappingErrorProperty } from 'src/app/core/models/misc/tracking.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = true;

  importInProgress: boolean = true;

  processedCount: number = 0;

  failedExpenseGroupCount: number | null = null;

  exportInProgress: boolean = false;

  exportProgressPercentage: number = 0;

  exportableExpenseGroupIds: number[];

  lastExport: LastExport | null;

  errors: GroupedErrors;

  employeeFieldMapping: EmployeeFieldMapping;

  expenseGroupSetting: string;

  groupedErrorStat: GroupedErrorStat = {
    [ErrorType.EMPLOYEE_MAPPING]: null,
    [ErrorType.CATEGORY_MAPPING]: null,
    [ErrorType.TAX_MAPPING]: null
  };

  ExportState = ExportState;

  employeeName: string = this.userService.getUserProfile().full_name;

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors();

  getLastExport$: Observable<LastExport> = this.dashboardService.getLastExport();

  private taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private exportLogService: ExportLogService,
    private refinerService: RefinerService,
    private trackingService: TrackingService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }


  private pollExportStatus(exportableExpenseGroupIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableExpenseGroupIds, this.taskType))),
      takeWhile((response) => response.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter(task => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== TaskLogType.FETCHING_EXPENSE && task.type !== TaskLogType.CREATING_BILL_PAYMENT) && exportableExpenseGroupIds.includes(task.expense_group)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / exportableExpenseGroupIds.length) * 100);

      if (res.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length === 0) {
        this.isLoading = true;
        forkJoin([
          this.getExportErrors$,
          this.getLastExport$
        ]).subscribe(responses => {
          this.errors = this.formatErrors(responses[0]);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null,
            TAX_MAPPING: null
          };
          this.lastExport = responses[1];
          this.isLoading = false;
        });
        this.dashboardService.getAllTasks([TaskLogState.FAILED, TaskLogState.FATAL]).subscribe((taskResponse) => {
          this.failedExpenseGroupCount = taskResponse.count;
          this.exportableExpenseGroupIds = taskResponse.results.map((task: Task) => task.expense_group);
          this.exportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;

          if (this.failedExpenseGroupCount === 0) {
            this.refinerService.triggerSurvey(RefinerSurveyType.EXPORT_DONE);
          }
        });
      }
    });
  }

  private formatErrors(errors: Error[]): GroupedErrors {
    return errors.reduce((groupedErrors: GroupedErrors, error: Error) => {
      const group: Error[] = groupedErrors[error.type] || [];
      group.push(error);
      groupedErrors[error.type] = group;

      return groupedErrors;
    }, {
      [ErrorType.EMPLOYEE_MAPPING]: [],
      [ErrorType.CATEGORY_MAPPING]: [],
      [ErrorType.TAX_MAPPING]: [],
      [ErrorType.QBO_ERROR]: []
    });
  }

  private getExpenseGroupingSetting(expenseGroupSetting: ExpenseGroupSetting): string {
    const grouping: string[] = expenseGroupSetting.reimbursable_expense_group_fields ? expenseGroupSetting.reimbursable_expense_group_fields : expenseGroupSetting.corporate_credit_card_expense_group_fields;
    if (grouping.includes(FyleReferenceType.EXPENSE)) {
      return 'expense';
    } else if (grouping.includes(FyleReferenceType.REPORT_ID)) {
      return 'report';
    } else if (grouping.includes(FyleReferenceType.PAYMENT)) {
      return 'payment';
    }

    return '';
  }

  private setupPage(): void {
    forkJoin([
      this.getLastExport$.pipe(map((res) => res), catchError(() => of(null))),
      this.getExportErrors$,
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.taskType),
      this.exportLogService.getExpenseGroupSettings()
    ]).subscribe((responses) => {
      this.lastExport = responses[0];
      this.errors = this.formatErrors(responses[1]);
      this.employeeFieldMapping = responses[2].employee_field_mapping;
      this.expenseGroupSetting = this.getExpenseGroupingSetting(responses[4]);

      const queuedTasks: Task[] = responses[3].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[3].results.filter((task: Task) => task.status === TaskLogState.FAILED).length;

      if (queuedTasks.length) {
        this.importInProgress = false;
        this.exportInProgress = true;
        this.exportableExpenseGroupIds = responses[3].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS).map((task: Task) => task.expense_group);
        this.pollExportStatus(this.exportableExpenseGroupIds);
      } else {
        this.dashboardService.importExpenseGroups().subscribe(() => {
          this.dashboardService.getExportableGroupsIds().subscribe((exportableExpenseGroups: ExportableExpenseGroup) => {
            this.exportableExpenseGroupIds = exportableExpenseGroups.exportable_expense_group_ids;
            this.importInProgress = false;
          });
        });
      }
      this.isLoading = false;
    });
  }

  private trackTimeTakenForResolvingMappingErrors(eventStartTime: Date, errorType: ErrorType): void {
    if (errorType === ErrorType.CATEGORY_MAPPING || errorType === ErrorType.EMPLOYEE_MAPPING || errorType === ErrorType.TAX_MAPPING) {
      const error = this.groupedErrorStat[errorType];

      if (error?.totalCount && error?.totalCount > 0) {
        const properties: ResolveMappingErrorProperty = {
          resolvedCount: error?.resolvedCount ? error?.resolvedCount : 0,
          totalCount: error?.totalCount ? error?.totalCount : 0,
          unresolvedCount: error?.totalCount - error?.resolvedCount,
          resolvedAllErrors: error.resolvedCount === error.totalCount,
          startTime: eventStartTime,
          endTime: new Date(),
          durationInSeconds: Math.floor((new Date().getTime() - eventStartTime.getTime()) / 1000),
          errorType: errorType
        };

        this.trackingService.onErrorResolve(properties);
      }
    }
  }

  private showErrorStats(eventStartTime: Date, errorType: ErrorType): void {
    this.getExportErrors$.subscribe((errors) => {
      const newError: GroupedErrors = this.formatErrors(errors);

      if (this.errors.CATEGORY_MAPPING.length !== newError.CATEGORY_MAPPING.length) {
        const totalCount = this.groupedErrorStat.CATEGORY_MAPPING ? this.groupedErrorStat.CATEGORY_MAPPING.totalCount : this.errors.CATEGORY_MAPPING.length;

        this.groupedErrorStat.CATEGORY_MAPPING = {
          resolvedCount: totalCount - newError.CATEGORY_MAPPING.length,
          totalCount: totalCount
        };
      }

      if (this.errors.EMPLOYEE_MAPPING.length !== newError.EMPLOYEE_MAPPING.length) {
        const totalCount = this.groupedErrorStat.EMPLOYEE_MAPPING ? this.groupedErrorStat.EMPLOYEE_MAPPING.totalCount : this.errors.EMPLOYEE_MAPPING.length;

        this.groupedErrorStat.EMPLOYEE_MAPPING = {
          resolvedCount: totalCount - newError.EMPLOYEE_MAPPING.length,
          totalCount: totalCount
        };
      }

      if (this.errors.TAX_MAPPING.length !== newError.TAX_MAPPING.length) {
        const totalCount = this.groupedErrorStat.TAX_MAPPING ? this.groupedErrorStat.TAX_MAPPING.totalCount : this.errors.TAX_MAPPING.length;

        this.groupedErrorStat.TAX_MAPPING = {
          resolvedCount: totalCount - newError.TAX_MAPPING.length,
          totalCount: totalCount
        };
      }

      this.errors = newError;
      this.trackTimeTakenForResolvingMappingErrors(eventStartTime, errorType);
    });
  }

  resolveMappingError(groupedError: Error[]): void {
    const eventStartTime = new Date();
    const errorType = groupedError[0].type;
    let sourceType: FyleField | null = null;
    let destinationType: QBOField | EmployeeFieldMapping | null = null;

    if (errorType === ErrorType.EMPLOYEE_MAPPING) {
      sourceType = FyleField.EMPLOYEE;
      destinationType = this.employeeFieldMapping;
    } else if (errorType === ErrorType.CATEGORY_MAPPING) {
      sourceType = FyleField.CATEGORY;
      destinationType = QBOField.ACCOUNT;
    } else if (errorType === ErrorType.TAX_MAPPING) {
      sourceType = FyleField.TAX_GROUP;
      destinationType = QBOField.TAX_CODE;
    }

    const dialogRef = this.dialog.open(DashboardResolveMappingErrorDialogComponent, {
      width: '784px',
      height: '974px',
      data: {
        sourceType: sourceType,
        destinationType: destinationType,
        fyleAttributes: groupedError,
        workspaceId: this.workspaceService.getWorkspaceId()
      },
      position: {
        top: '0px',
        right: '0px'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.showErrorStats(eventStartTime, errorType);
    });
  }

  showDashboardExportLog(exportState: ExportState): void {
    const event = exportState === ExportState.SUCCESS ? ClickEvent.SUCCESSFUL_EXPORTS : ClickEvent.FAILED_EXPORTS;
    this.trackingService.onClickEvent(event);

    this.dialog.open(DashboardExportLogDialogComponent, {
      width: '784px',
      height: '974px',
      data: {
        exportState: exportState,
        lastExportedAt: exportState === ExportState.SUCCESS && this.lastExport?.last_exported_at ? this.lastExport.last_exported_at : null
      },
      position: {
        top: '0px',
        right: '0px'
      }
    });
  }

  showDashboardQboError(error: Error): void {
    this.dialog.open(DashboardQboErrorDialogComponent, {
      width: '784px',
      height: '974px',
      data: error,
      position: {
        top: '0px',
        right: '0px'
      }
    });
  }

  export(): void {
    if (!this.exportInProgress && this.exportableExpenseGroupIds.length) {
      this.exportInProgress = true;
      this.trackingService.onClickEvent(ClickEvent.EXPORT);
      this.dashboardService.exportExpenseGroups().subscribe(() => {
        this.pollExportStatus(this.exportableExpenseGroupIds);
      });
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
