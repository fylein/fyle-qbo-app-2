import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { ExpenseGroupList } from 'src/app/core/models/db/expense-group.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExportLogTableComponent } from './export-log-table.component';
import { EXPENSE_GROUP_LISTS } from './export-log-table.fixture';

describe('ExportLogTableComponent', () => {
  let component: ExportLogTableComponent;
  let fixture: ComponentFixture<ExportLogTableComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ ExportLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogTableComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display one row of export log', () => {
    component.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('it should bind right properties for the given data', () => {
    component.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    component.expenseGroups = new MatTableDataSource<ExpenseGroupList>(EXPENSE_GROUP_LISTS);
    fixture.detectChanges();

    const expectedExpenseGroupRow = EXPENSE_GROUP_LISTS[0];

    const exportLogRow = el.queryAll(By.css('td'));
    const exportedAtDate = exportLogRow[0].children[0].nativeElement.innerText;
    const exportedAtTime = exportLogRow[0].children[1].nativeElement.innerText;
    const employeeName = exportLogRow[1].children[0].nativeElement.innerText;
    const employeeEmail = exportLogRow[1].children[1].nativeElement.innerText;
    const fundSource = exportLogRow[2].nativeElement.innerText;
    const referenceID = exportLogRow[3].nativeElement.innerText;
    const exportType = exportLogRow[4].nativeElement.innerText;
    const qboUrl = exportLogRow[5].nativeElement;

    expect(exportLogRow).toBeTruthy();
    expect(exportedAtDate).toBeTruthy();
    expect(exportedAtTime).toBeTruthy();
    expect(employeeName).toBe(expectedExpenseGroupRow.employee[0]);
    expect(employeeEmail).toBe(expectedExpenseGroupRow.employee[1]);
    expect(fundSource).toBe(expectedExpenseGroupRow.expenseType);
    expect(referenceID).toBe(expectedExpenseGroupRow.referenceNumber);
    expect(exportType).toBe(expectedExpenseGroupRow.exportedAs);
    expect(qboUrl).toBeTruthy();
  });
});
