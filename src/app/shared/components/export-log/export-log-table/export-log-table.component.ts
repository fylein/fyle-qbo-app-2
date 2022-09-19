import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { Expense } from 'src/app/core/models/db/expense.model';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { ExportLogChildDialogComponent } from 'src/app/integration/main/export-log/export-log-child-dialog/export-log-child-dialog.component';

@Component({
  selector: 'app-export-log-table',
  templateUrl: './export-log-table.component.html',
  styleUrls: ['./export-log-table.component.scss']
})
export class ExportLogTableComponent implements OnInit {

  @Input() displayedColumns: string[] = [];

  @Input() expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  @Input() externalUrlType: string = 'QuickBooks Online';

  // Disable opening of child expenses when this component is used in dashboard export dialog
  @Input() allowChildViewing: boolean = true;

  FyleReferenceType = FyleReferenceType;

  constructor(
    private dialog: MatDialog,
    public helperService: HelperService
  ) { }

  openChildExpenses(selectedRow: ExpenseGroupList): void {
    if (selectedRow.fyleReferenceType !== FyleReferenceType.EXPENSE && this.allowChildViewing) {
      this.dialog.open(ExportLogChildDialogComponent, {
        width: '784px',
        height: '974px',
        data: selectedRow.expenses,
        position: {
          top: '0px',
          right: '0px'
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
