import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ZeroStatePage } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-export-log-child-dialog',
  templateUrl: './export-log-child-dialog.component.html',
  styleUrls: ['./export-log-child-dialog.component.scss']
})
export class ExportLogChildDialogComponent implements OnInit {

  form: UntypedFormGroup;

  displayedColumns: string[] = ['expenseID', 'merchant', 'category', 'amount'];

  isLoading: boolean = true;

  private org_id: string = this.userService.getUserProfile().org_id;

  expenses: MatTableDataSource<ExpenseList> = new MatTableDataSource<ExpenseList>([]);

  ZeroStatePage = ZeroStatePage;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Expense[],
    public dialogRef: MatDialogRef<ExportLogChildDialogComponent>,
    public helperService: HelperService,
    private userService: UserService
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

  private setupTable(expenseList: Expense[]): void {
    const expenses: ExpenseList[] = [];

    expenseList.forEach((expense: Expense) => {
      expenses.push({
        fyleUrl: `${environment.fyle_app_url}/app/main/#/view_expense/${expense.expense_id}?org_id=${this.org_id}`,
        amount: [expense.amount, expense.currency],
        merchant: expense.vendor,
        category: expense.category,
        expenseID: expense.expense_number
      });
    });

    this.expenses = new MatTableDataSource(expenses);
    this.expenses.filterPredicate = this.searchByText;

    this.isLoading = false;
  }

  private searchByText(expense: ExpenseList, filterText: string) {
    return expense.expenseID.toLowerCase().includes(filterText.toLowerCase());
  }

  private setupPage(): void {
    this.setupForm();
    this.setupTable(this.data);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
