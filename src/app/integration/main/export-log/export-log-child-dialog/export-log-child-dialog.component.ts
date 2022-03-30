import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';

@Component({
  selector: 'app-export-log-child-dialog',
  templateUrl: './export-log-child-dialog.component.html',
  styleUrls: ['./export-log-child-dialog.component.scss']
})
export class ExportLogChildDialogComponent implements OnInit {

  form: FormGroup;
  displayedColumns: string[] = ['expenseID', 'merchant', 'category', 'amount'];
  isLoading: boolean = true;
  expenses: MatTableDataSource<ExpenseList> = new MatTableDataSource<ExpenseList>([]);

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<ExportLogChildDialogComponent>,
    private exportLogService: ExportLogService,
    public helperService: HelperService
  ) { }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      searchOption: ['']
    });

    this.form.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.expenses.filter = searchTerm.trim().toLowerCase();
      } else {
        this.expenses.filter = '';
      }
    });
  }

  getExpenses(expenseGroupID: number): void {
    const expenses: ExpenseList[] = [];

    this.exportLogService.getExpensesByExpenseGroupId(expenseGroupID).subscribe((expensesResponse: Expense[]) => {
      expensesResponse.forEach((expense: Expense) => {
        // TODO: add org_id to fyle url
        expenses.push({
          fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${expense.expense_id}`,
          amount: [expense.amount, expense.currency],
          merchant: expense.vendor,
          category: expense.category,
          expenseID: expense.expense_number
        });

        this.expenses = new MatTableDataSource(expenses);
        this.expenses.filterPredicate = this.searchByText;
      });

      this.isLoading = false;
    });
  }

  private searchByText(expense: ExpenseList, filterText: string) {
    return expense.expenseID.toLowerCase().includes(filterText);
  }

  private getExpensesAndSetupPage(): void {
    this.setupForm();
    this.getExpenses(this.data);
  }

  ngOnInit(): void {
    this.getExpensesAndSetupPage();
  }

}
