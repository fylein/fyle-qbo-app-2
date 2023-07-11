import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ExpenseGroup, ExpenseGroupList, ExpenseGroupResponse, SkipExportList, SkipExportLog, SkipExportLogResponse } from 'src/app/core/models/db/expense-group.model';
import { FyleReferenceType, PaginatorPage, SimpleSearchPage, SimpleSearchType, ZeroStatePage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  emptyExpenseGroup: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  skipExport: MatTableDataSource<SkipExportList> = new MatTableDataSource<SkipExportList>([]);

  emptySkipExportList: MatTableDataSource<SkipExportList> = new MatTableDataSource<SkipExportList>([]);

  displayedColumns: string[] = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];

  skippedExpenseColumns: string[] = ['updated_at', 'claim_number', 'name', 'expenseType'];

  isLoading: boolean = true;

  state: string = 'COMPLETE';

  exportLogForm: UntypedFormGroup;

  skipExportLogForm: UntypedFormGroup;

  limit: number;

  offset: number;

  totalCount: number;

  totalSkipCount: number;

  FyleReferenceType = FyleReferenceType;

  selectedDateFilter: SelectedDateFilter | null;

  selectedDateFilterSkipExport: SelectedDateFilter | null;

  dateOptions: DateFilter[] = [
    {
      dateRange: 'This Month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    },
    {
      dateRange: 'This Week',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
      endDate: new Date()
    },
    {
      dateRange: 'Today',
      startDate: new Date(),
      endDate: new Date()
    }
  ];

  PaginatorPage = PaginatorPage;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  ZeroStatePage = ZeroStatePage;

  constructor(
    public dialog: MatDialog,
    private exportLogService: ExportLogService,
    private formBuilder: UntypedFormBuilder,
    public helperService: HelperService,
    private paginatorService: PaginatorService,
    private trackingService: TrackingService
  ) { }

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(trackingProperty);
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.exportLogForm.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.expenseGroups.filter = searchTerm.trim().toLowerCase();
      } else {
        this.expenseGroups.filter = '';
      }
    });

    this.exportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      if (dateRange) {
        this.selectedDateFilter = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };

        this.trackDateFilter('existing', this.selectedDateFilter);

        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
        this.getExpenseGroups(paginator);
      }
    });
  }

  private setupSkipExportForm(): void {
    this.skipExportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.skipExportLogForm.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.skipExport.filter = searchTerm.trim().toLowerCase();
      } else {
        this.skipExport.filter = '';
      }
    });

    this.skipExportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      if (dateRange) {
        this.selectedDateFilterSkipExport = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };
        this.trackDateFilter('existing', this.selectedDateFilterSkipExport);

        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
        this.getSkipExportLog(paginator);
      }
    });
  }

  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      if (state === 'SKIP') {
        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
        this.getSkipExportLog(paginator);
      } else {
        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
        this.getExpenseGroups(paginator);
      }
      that.state = state;
    }
  }

  clearDateFilter(): void {
    this.selectedDateFilter = null;
    this.totalCount = 0;
    event?.stopPropagation();
    this.exportLogForm.controls.dateRange.patchValue(null);
    this.exportLogForm.controls.start.patchValue('');
    this.exportLogForm.controls.end.patchValue('');

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.getExpenseGroups(paginator);
  }

  clearDateFilterSkipExport(): void {
    this.selectedDateFilterSkipExport = null;
    this.totalSkipCount = 0;
    event?.stopPropagation();
    this.skipExportLogForm.controls.dateRange.patchValue(null);
    this.skipExportLogForm.controls.start.patchValue('');
    this.skipExportLogForm.controls.end.patchValue('');

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.getSkipExportLog(paginator);
  }

  dateFilterHandler(): void {
    this.selectedDateFilter = {
      startDate: this.exportLogForm.controls.start.value,
      endDate: this.exportLogForm.controls.end.value
    };

    this.trackDateFilter('custom', this.selectedDateFilter);

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.getExpenseGroups(paginator);
  }

  dateFilterHandlerSkipExport(): void {
    this.selectedDateFilterSkipExport = {
      startDate: this.skipExportLogForm.controls.start.value,
      endDate: this.skipExportLogForm.controls.end.value
    };

    this.trackDateFilter('custom', this.selectedDateFilterSkipExport);

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.getSkipExportLog(paginator);
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

    this.exportLogService.getExpenseGroups(TaskLogState.COMPLETED, data.limit, data.offset, this.selectedDateFilter).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
      this.totalCount = expenseGroupResponse.count;
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        const [type, id, exportType] = this.exportLogService.generateExportTypeAndId(expenseGroup);
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
          qboUrl: `${environment.qbo_app_url}/app/${type}?txnId=${id}`,
          expenses: expenseGroup.expenses
        });
      });
      this.expenseGroups = new MatTableDataSource(expenseGroups);
      this.expenseGroups.filterPredicate = this.searchByText;

      this.isLoading = false;
    });
  }

  getSkipExportLog(data: Paginator): void {
    this.isLoading = true;
    const skipExport: SkipExportList[] = [];

    // Store page size when user changes it
    if (this.limit !== data.limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, data.limit);
    }

    this.limit = data.limit;
    this.offset = data.offset;

    this.exportLogService.getSkippedExpenses(data.limit, data.offset, this.selectedDateFilterSkipExport).subscribe((skipExportResponse: SkipExportLogResponse) => {
      this.totalSkipCount = skipExportResponse.count;
      skipExportResponse.results.forEach((skippedExpense: SkipExportLog) => {
        skipExport.push({
          updated_at: skippedExpense.updated_at,
          employee: [skippedExpense.employee_name, skippedExpense.employee_email],
          expenseType: skippedExpense.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
          claim_number: skippedExpense.claim_number
        });
      });
      this.skipExport = new MatTableDataSource(skipExport);
      this.skipExport.filterPredicate = this.searchByTextSkipExport;

      this.isLoading = false;
    });
  }

  private searchByText(expenseGroup: ExpenseGroupList, filterText: string) {
    filterText = filterText.toLowerCase();
    return expenseGroup.employee[0].toLowerCase().includes(filterText) || expenseGroup.employee[1].toLowerCase().includes(filterText) || expenseGroup.referenceNumber.toLowerCase().includes(filterText);
  }

  private searchByTextSkipExport(skipExport: SkipExportList, filterText: string) {
    filterText = filterText.toLowerCase();
    return skipExport.employee[0].toLowerCase().includes(filterText) || skipExport.employee[1].toLowerCase().includes(filterText) || skipExport.claim_number.toLowerCase().includes(filterText);
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    this.setupSkipExportForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);

    this.getExpenseGroups(paginator);
  }

  ngOnInit(): void {
    this.getExpenseGroupsAndSetupPage();
  }

}
