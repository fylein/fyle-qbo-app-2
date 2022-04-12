import { Component, OnInit } from '@angular/core';
import { forkJoin, from, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Error, GroupedErrors } from 'src/app/core/models/db/error.model';
import { PastExport } from 'src/app/core/models/db/past-export.model';
import { ErrorType } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = true;
  zeroState: boolean = false;
  processedCount: number = 0;
  successfulExpenseGroupCount: number;
  failedExpenseGroupCount: number;
  exportInProgress: boolean = false;
  exportProgressPercentage: number = 0;
  exportableExpenseGroupIds: number[];
  pastExport: PastExport;
  errors: GroupedErrors;

  constructor(
    private dashboardService: DashboardService
  ) { }


  private pollExportStatus(): void {
    const taskType = ['CREATING_BILL', 'CREATING_EXPENSE', 'CREATING_CHECK', 'CREATING_CREDIT_CARD_PURCHASE', 'CREATING_JOURNAL_ENTRY', 'CREATING_CREDIT_CARD_CREDIT', 'CREATING_DEBIT_CARD_EXPENSE'];
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], this.exportableExpenseGroupIds, taskType))),
      takeWhile((response) => response.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && this.exportableExpenseGroupIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter(task => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== 'FETCHING_EXPENSES' && task.type !== 'CREATING_BILL_PAYMENT') && this.exportableExpenseGroupIds.includes(task.expense_group)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableExpenseGroupIds.length) * 100);

      if (res.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && this.exportableExpenseGroupIds.includes(task.expense_group)).length === 0) {
        this.dashboardService.getAllTasks(['FAILED', 'FATAL']).subscribe((taskResponse) => {
          this.failedExpenseGroupCount = taskResponse.count;
          this.successfulExpenseGroupCount = this.exportableExpenseGroupIds.length - this.failedExpenseGroupCount;
          this.exportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;
        });
      }
    });

  }

  export(): void {
    if (!this.exportInProgress) {
      this.exportInProgress = true;
      this.dashboardService.exportExpenseGroups(this.exportableExpenseGroupIds).subscribe(() => {
        this.pollExportStatus();
      });
    }
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
    // TODO: check active exports
    forkJoin([
      this.dashboardService.getPastExport(),
      this.dashboardService.getExportableGroupsIds(),
      this.dashboardService.getExportErrors()
    ]).subscribe((responses) => {
      this.pastExport = responses[0];
      this.exportableExpenseGroupIds = responses[1];
      this.errors = this.formatErrors(responses[2]);
      console.log(this.errors)

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
