import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { Expense, ExpenseList } from 'src/app/core/models/db/expense.model';
import { SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { EXPENSE_GROUP_LISTS } from '../../export-log/export-log-table/export-log-table.fixture';

import { ZeroStateWithIllustrationComponent } from './zero-state-with-illustration.component';

xdescribe('ZeroStateWithIllustrationComponent', () => {
  let component: ZeroStateWithIllustrationComponent;
  let fixture: ComponentFixture<ZeroStateWithIllustrationComponent>;
  let el: DebugElement;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ ZeroStateWithIllustrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStateWithIllustrationComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('table data testing', () => {
    const form= new FormGroup({
      dateRange: new FormControl([3]),
      start: new FormControl(['12/1/2021']),
      searchOption: new FormControl(['come']),
      end: new FormControl(['12/2/2021'])
    });
    const datefilter: SelectedDateFilter = {
      startDate: new Date(),
      endDate: new Date()
    };
    component.form = form;
    component.page = 'export_log';
    component.searchTerm = 'string';
    component.dateFilter = datefilter;
    component.data = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const expectedExpenseGroupRow = EXPENSE_GROUP_LISTS[0];

    const exportLogRow = fixture.debugElement.query(By.css('*'));
    // Const exportedAtDate = exportLogRow[0].children[0].nativeElement.innerText;
    // Const exportedAtTime = exportLogRow[0].children[1].nativeElement.innerText;
    // Const employeeName = exportLogRow[1].children[0].nativeElement.innerText;
    // Const employeeEmail = exportLogRow[1].children[1].nativeElement.innerText;
    // Const fundSource = exportLogRow[2].nativeElement.innerText;
    // Const referenceID = exportLogRow[3].nativeElement.innerText;
    // Const exportType = exportLogRow[4].nativeElement.innerText;
    // Const qboUrl = exportLogRow[5].nativeElement;

    expect(exportLogRow).toBeTruthy();
    // Expect(exportedAtDate).toBeTruthy();
    // Expect(exportedAtTime).toBeTruthy();
    // Expect(employeeName).toBe(expectedExpenseGroupRow.employee[0]);
    // Expect(employeeEmail).toBe(expectedExpenseGroupRow.employee[1]);
    // Expect(fundSource).toBe(expectedExpenseGroupRow.expenseType);
    // Expect(referenceID).toBe(expectedExpenseGroupRow.referenceNumber);
    // Expect(exportType).toBe(expectedExpenseGroupRow.exportedAs);
    // Expect(qboUrl).toBeTruthy();
  });
});
