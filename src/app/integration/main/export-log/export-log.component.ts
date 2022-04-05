import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupList, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { FyleReferenceType, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ExportLogChildDialogComponent } from './export-log-child-dialog/export-log-child-dialog.component';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { Expense } from 'src/app/core/models/db/expense.model';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);
  displayedColumns: string[] = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
  isLoading: boolean = true;
  exportLogForm: FormGroup;
  limit: number;
  offset: number;
  totalCount: number;
  FyleReferenceType = FyleReferenceType;

  constructor(
    public dialog: MatDialog,
    private exportLogService: ExportLogService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private paginatorService: PaginatorService
  ) { }

  openChildExpenses(expenses: Expense[]): void {
    if (expenses.length > 1) {
      this.dialog.open(ExportLogChildDialogComponent, {
        width: '784px',
        height: '974px',
        data: expenses,
        position: {
          top: '0px',
          right: '0px'
        }
      });
    }
  }

  private generateExportTypeAndId(expenseGroup: ExpenseGroup) {
    let exportRedirection = null;
    let exportType = null;
    let exportId = null;

    if ('Bill' in expenseGroup.response_logs && expenseGroup.response_logs.Bill) {
      exportRedirection = 'bill';
      exportType = exportRedirection;
      exportId = expenseGroup.response_logs.Bill.Id;
    } else if ('JournalEntry' in expenseGroup.response_logs && expenseGroup.response_logs.JournalEntry) {
      exportRedirection = 'journal';
      exportType = 'Journal Entry';
      exportId = expenseGroup.response_logs.JournalEntry.Id;
    } else if ('Purchase' in expenseGroup.response_logs && expenseGroup.response_logs.Purchase) {
      exportId = expenseGroup.response_logs.Purchase.Id;
      if (expenseGroup.response_logs.Purchase.PaymentType === 'Check') {
        exportRedirection = 'check';
        exportType = exportRedirection;
      } else {
        exportRedirection = 'expense';
        if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && !expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Purchase';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Credit';
          exportRedirection = 'creditcardcredit';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'Cash') {
          exportType = 'Debit Card Expense';
          exportRedirection = 'expense';
        } else {
          exportType = 'expense';
        }
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: ['']
    });

    this.exportLogForm.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.expenseGroups.filter = searchTerm.trim().toLowerCase();
      } else {
        this.expenseGroups.filter = '';
      }
    });
  }

  private getReferenceNumber(description: ExpenseGroupDescription): FyleReferenceType {
    let referenceNumber = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceNumber = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceNumber = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceNumber = FyleReferenceType.PAYMENT;
    }

    return referenceNumber;
  }

  private generateFyleUrl(expenseGroup: ExpenseGroup, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/admin/#`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      // TODO: add org_id to fyle url
      url += `/view_expense/${expenseGroup.description.expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `/reports/${expenseGroup.description.report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `/settlements/${expenseGroup.description.settlement_id}`;
    }

    return url;
  }

  getExpenseGroups(data: Paginator): void {
    this.isLoading = true;
    const expenseGroups: ExpenseGroupList[] = [];

    // Store page size when user changes it
    if (this.limit !== data.limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, data.limit);
    }

    this.limit = data.limit;
    this.offset = data.offset;

    this.exportLogService.getExpenseGroups('COMPLETE', data.limit, data.offset).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
      this.totalCount = expenseGroupResponse.count;
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        const [type, id, exportType] = this.generateExportTypeAndId(expenseGroup);
        const referenceType: FyleReferenceType = this.getReferenceNumber(expenseGroup.description);
        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
        }

        const fyleUrl = this.generateFyleUrl(expenseGroup, referenceType);

        expenseGroups.push({
          exportedAt: expenseGroup.exported_at,
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          expenseType: expenseGroup.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
          fyleReferenceType: referenceType,
          referenceNumber: referenceNumber,
          exportedAs: exportType,
          fyleUrl: fyleUrl,
          qboUrl: `${environment.qbo_app_url}/app/${type}?txnId=${id}`,
          expenses: expenseGroup.expenses
        });

        this.expenseGroups = new MatTableDataSource(expenseGroups);
        this.expenseGroups.filterPredicate = this.searchByText;
      });

      this.isLoading = false;
    });
  }

  private searchByText(expenseGroup: ExpenseGroupList, filterText: string) {
    return expenseGroup.employee[0].includes(filterText) || expenseGroup.employee[1].includes(filterText);
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);

    this.getExpenseGroups(paginator);
  }

  ngOnInit(): void {
    this.getExpenseGroupsAndSetupPage();
  }

}
