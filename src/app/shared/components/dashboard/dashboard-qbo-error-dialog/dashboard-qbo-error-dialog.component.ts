import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Error } from 'src/app/core/models/db/error.model';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-qbo-error-dialog',
  templateUrl: './dashboard-qbo-error-dialog.component.html',
  styleUrls: ['./dashboard-qbo-error-dialog.component.scss']
})
export class DashboardQboErrorDialogComponent implements OnInit {

  expenses: MatTableDataSource<ExpenseList> = new MatTableDataSource<ExpenseList>([]);
  private org_id: string = this.userService.getUserProfile().org_id;
  displayedColumns: string[] = ['expenseID', 'name', 'fundSource'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Error,
    public dialogRef: MatDialogRef<DashboardQboErrorDialogComponent>,
    private userService: UserService
  ) { }

  private setupPage(): void {
    const expenses: ExpenseList[] = [];

    this.data.expense_group.expenses.forEach((expense: Expense) => {
      expenses.push({
        fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${expense.expense_id}?org_id=${this.org_id}`,
        expenseID: expense.expense_number,
        name: [this.data.expense_group.employee_name, this.data.expense_group.description.employee_email],
        fundSource: this.data.expense_group.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable'
      });
    });

    this.expenses = new MatTableDataSource(expenses);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
