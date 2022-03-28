import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'environment.localhost';
import { ExpenseGroup, ExpenseGroupList, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  expenseGroups: ExpenseGroupList[];
  displayedColumns: string[];
  isLoading: boolean = true;
  exportLogForm: FormGroup;
  limit: number;
  offset: number;
  totalCount: number;
  private windowReference: Window;

  constructor(
    private exportLogService: ExportLogService,
    private formBuilder: FormBuilder,
    private paginatorService: PaginatorService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  openInQBO(url: string): void {
    this.windowReference.open(url, '_blank');
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
  }

  getExpenseGroups(data: Paginator): void {
    this.isLoading = true;
    this.expenseGroups = [];

    // Store page size when user changes it
    if (this.limit !== data.limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, data.limit);
    }

    this.limit = data.limit;
    this.offset = data.offset;

    this.exportLogService.getExpenseGroups('ALL', data.limit, data.offset).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
      this.totalCount = expenseGroupResponse.count;
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        const [type, id, exportType] = this.generateExportTypeAndId(expenseGroup);

        this.expenseGroups.push({
          'exportedAt': expenseGroup.exported_at,
          'employee': ['name', expenseGroup.description.employee_email],
          'expenseType': expenseGroup.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
          'referenceNumber': expenseGroup.description.claim_number,
          'exportedAs': exportType,
          'url': `${environment.qbo_app_url}/app/${type}?txnId=${id}`
        });
      });

      this.isLoading = false;
    });
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);

    this.getExpenseGroups(paginator);
  }

  ngOnInit(): void {
    this.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    this.getExpenseGroupsAndSetupPage();
  }

}
