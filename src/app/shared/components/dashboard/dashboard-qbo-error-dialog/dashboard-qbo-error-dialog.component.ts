import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environment.localhost';
import { Error } from 'src/app/core/models/db/error.model';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';

@Component({
  selector: 'app-dashboard-qbo-error-dialog',
  templateUrl: './dashboard-qbo-error-dialog.component.html',
  styleUrls: ['./dashboard-qbo-error-dialog.component.scss']
})
export class DashboardQboErrorDialogComponent implements OnInit {

  expenses: MatTableDataSource<ExpenseList> = new MatTableDataSource<ExpenseList>([]);
  displayedColumns: string[] = ['expenseID', 'name', 'fundSource', 'account', 'customer', 'class'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Error,
    public dialogRef: MatDialogRef<DashboardQboErrorDialogComponent>,
  ) { }

  private setupPage(): void {
    const expenses: ExpenseList[] = [];

    console.log(this.data)
    this.data.expense_group.expenses.forEach((expense: Expense) => {
      // TODO: add org_id to fyle url
      expenses.push({
        fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${expense.expense_id}`,
        expenseID: expense.expense_number,
        name: [this.data.expense_group.employee_name, this.data.expense_group.description.employee_email],
        fundSource: this.data.expense_group.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
        account: 'QBO Account',
        customer: 'QBO Customer',
        class: 'QBO Class'
      });
    });

    console.log(expenses)
    this.expenses = new MatTableDataSource(expenses);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
