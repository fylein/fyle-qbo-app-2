import { Component, OnInit } from '@angular/core';
import { forkJoin, from, interval, Observable } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Error, GroupedErrors, GroupedErrorStat } from 'src/app/core/models/db/error.model';
import { LastExport } from 'src/app/core/models/db/last-export.model';
import { EmployeeFieldMapping, ErrorType, ExportState, FyleField, QBOField, TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { DashboardResolveMappingErrorDialogComponent } from 'src/app/shared/components/dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping-error-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { DashboardExportLogDialogComponent } from 'src/app/shared/components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardQboErrorDialogComponent } from 'src/app/shared/components/dashboard/dashboard-qbo-error-dialog/dashboard-qbo-error-dialog.component';
import { Task } from 'src/app/core/models/db/task-log.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportableExpenseGroup } from 'src/app/core/models/db/expense-group.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = true;
  importInProgress: boolean = true;
  processedCount: number = 0;
  failedExpenseGroupCount: number;
  exportInProgress: boolean = false;
  exportProgressPercentage: number = 0;
  exportableExpenseGroupIds: number[];
  lastExport: LastExport;
  errors: GroupedErrors;
  employeeFieldMapping: EmployeeFieldMapping;
  groupedErrorStat: GroupedErrorStat = {
    [ErrorType.EMPLOYEE_MAPPING]: null,
    [ErrorType.CATEGORY_MAPPING]: null
  };
  ExportState = ExportState;
  employeeName: string = this.userService.getUserProfile().full_name;
  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors();
  private taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSE, TaskLogType.CREATING_BILL, TaskLogType.CREATING_EXPENSE, TaskLogType.CREATING_CHECK, TaskLogType.CREATING_CREDIT_CARD_PURCHASE, TaskLogType.CREATING_JOURNAL_ENTRY, TaskLogType.CREATING_CREDIT_CARD_CREDIT, TaskLogType.CREATING_DEBIT_CARD_EXPENSE];

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }


  private pollExportStatus(exportableExpenseGroupIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableExpenseGroupIds, this.taskType))),
      takeWhile((response) => response.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter(task => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== 'FETCHING_EXPENSES' && task.type !== 'CREATING_BILL_PAYMENT') && exportableExpenseGroupIds.includes(task.expense_group)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / exportableExpenseGroupIds.length) * 100);

      if (res.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length === 0) {
        this.getExportErrors$.subscribe((errors: Error[]) => {
          this.errors = this.formatErrors(errors);
        });
        this.dashboardService.getAllTasks([TaskLogState.FAILED, TaskLogState.FATAL]).subscribe((taskResponse) => {
          this.failedExpenseGroupCount = taskResponse.count;
          this.exportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;
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
      [ErrorType.QBO_ERROR]: []
    });
  }

  private setupPage(): void {
    forkJoin([
      this.dashboardService.getLastExport(),
      this.getExportErrors$,
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS], undefined, this.taskType)
    ]).subscribe((responses) => {
      this.lastExport = responses[0];
      this.errors = this.formatErrors(responses[1]);
      this.employeeFieldMapping = responses[2].employee_field_mapping;

      if (responses[3].count) {
        this.importInProgress = false;
        this.exportInProgress = true;
        this.exportableExpenseGroupIds = responses[3].results.map((task: Task) => task.expense_group);
        this.pollExportStatus();
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

  private showErrorStats(): void {
    this.getExportErrors$.subscribe((errors) => {
      const newError: GroupedErrors = this.formatErrors(errors);

      if (this.errors.CATEGORY_MAPPING.length !== newError.CATEGORY_MAPPING.length) {
        const totalCount = this.groupedErrorStat.CATEGORY_MAPPING ? this.groupedErrorStat.CATEGORY_MAPPING.totalCount : this.errors.CATEGORY_MAPPING.length;

        this.groupedErrorStat.CATEGORY_MAPPING = {
          resolvedCount: totalCount - newError.CATEGORY_MAPPING.length,
          totalCount: totalCount
        }
      }

      if (this.errors.EMPLOYEE_MAPPING.length !== newError.EMPLOYEE_MAPPING.length) {
        const totalCount = this.groupedErrorStat.EMPLOYEE_MAPPING ? this.groupedErrorStat.EMPLOYEE_MAPPING.totalCount : this.errors.EMPLOYEE_MAPPING.length;

        this.groupedErrorStat.EMPLOYEE_MAPPING = {
          resolvedCount: totalCount - newError.EMPLOYEE_MAPPING.length,
          totalCount: totalCount
        }
      }

      this.errors = newError;
    });
  }

  resolveMappingError(groupedError: Error[]): void {
    const errorType = groupedError[0].type;

    const dialogRef = this.dialog.open(DashboardResolveMappingErrorDialogComponent, {
      width: '784px',
      height: '974px',
      data: {
        sourceType: errorType === ErrorType.EMPLOYEE_MAPPING ? EmployeeFieldMapping.EMPLOYEE : FyleField.CATEGORY,
        destinationType: errorType === ErrorType.EMPLOYEE_MAPPING ? this.employeeFieldMapping : QBOField.ACCOUNT,
        fyleAttributes: groupedError,
        workspaceId: this.workspaceService.getWorkspaceId()
      },
      position: {
        top: '0px',
        right: '0px'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.showErrorStats();
    });
  }

  showDashboardExportLog(exportState: ExportState): void {
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
    if (!this.exportInProgress) {
      this.exportInProgress = true;
      this.dashboardService.exportExpenseGroups().subscribe(() => {
        this.pollExportStatus(this.exportableExpenseGroupIds);
      });
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
