import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseGroup, ExpenseGroupList, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { ExportState, FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-export-log-dialog',
  templateUrl: './dashboard-export-log-dialog.component.html',
  styleUrls: ['./dashboard-export-log-dialog.component.scss']
})
export class DashboardExportLogDialogComponent implements OnInit {

  expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);
  displayedColumns: string[];
  ExportState = ExportState;
  externalUrlType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {exportState: ExportState, lastExportedAt: Date},
    public dialogRef: MatDialogRef<DashboardExportLogDialogComponent>,
    private exportLogService: ExportLogService
  ) { }

  private setupPage(): void {
    if (this.data.exportState === ExportState.SUCCESS) {
      this.displayedColumns = ['referenceID', 'name', 'exportType', 'link'];
      this.externalUrlType = 'QBO';
    } else {
      this.displayedColumns = ['referenceID', 'name', 'link'];
      this.externalUrlType = 'Fyle';
    }

    const expenseGroups: ExpenseGroupList[] = [];
    const state: string = this.data.exportState === ExportState.SUCCESS ? 'COMPLETE' : 'FAILED';

    this.exportLogService.getExpenseGroups(state, 500, 0, null, this.data.lastExportedAt).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        let type: string = '', id: string = '', exportType: string = '';

        if (this.data.exportState === ExportState.SUCCESS) {
          [type, id, exportType] = this.exportLogService.generateExportTypeAndId(expenseGroup);
        }
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceNumber(expenseGroup.description);
        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
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
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
