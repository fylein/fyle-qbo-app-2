import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExpenseGroup, ExpenseGroupList, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { ExportState, FyleReferenceType, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-export-log-dialog',
  templateUrl: './dashboard-export-log-dialog.component.html',
  styleUrls: ['./dashboard-export-log-dialog.component.scss']
})
export class DashboardExportLogDialogComponent implements OnInit {

  isLoading: boolean = true;

  expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  emptyExpenseGroup: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  displayedColumns: string[];

  ExportState = ExportState;

  externalUrlType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {exportState: ExportState, lastExportedAt: string},
    public dialogRef: MatDialogRef<DashboardExportLogDialogComponent>,
    private exportLogService: ExportLogService
  ) { }

  private setupPage(): void {
    if (this.data.exportState === ExportState.SUCCESS) {
      this.displayedColumns = ['referenceID', 'name', 'exportType', 'link'];
      this.externalUrlType = 'QuickBooks Online';
    } else {
      this.displayedColumns = ['referenceID', 'name', 'link'];
      this.externalUrlType = 'Fyle';
    }

    const expenseGroups: ExpenseGroupList[] = [];
    const state: TaskLogState = this.data.exportState === ExportState.SUCCESS ? TaskLogState.COMPLETED : TaskLogState.FAILED;

    this.exportLogService.getExpenseGroups(state, 500, 0, null, this.data.lastExportedAt).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        let type: string = '', id: string = '', exportType: string = '';

        if (this.data.exportState === ExportState.SUCCESS) {
          [type, id, exportType] = this.exportLogService.generateExportTypeAndId(expenseGroup);
        }
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);
        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
        } else if (referenceType === FyleReferenceType.PAYMENT) {
          referenceNumber = expenseGroup.expenses[0].payment_number;
        }

        const fyleUrl = this.exportLogService.generateFyleUrl(expenseGroup, referenceType);

        expenseGroups.push({
          exportedAt: expenseGroup.exported_at,
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          expenseType: expenseGroup.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
          fyleReferenceType: referenceType,
          referenceNumber: referenceNumber,
          exportedAs: exportType,
          fyleUrl: fyleUrl,
          qboUrl: this.data.exportState === ExportState.SUCCESS ? `${environment.qbo_app_url}/app/${type}?txnId=${id}` : fyleUrl,
          expenses: expenseGroup.expenses
        });
      });
      this.expenseGroups = new MatTableDataSource(expenseGroups);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
